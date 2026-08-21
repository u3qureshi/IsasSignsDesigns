#!/usr/bin/env ruby

require "digest"
require "json"
require "open3"
require "optparse"

ROOT = File.expand_path("../..", __dir__)

PRODUCTS = [
  {
    style: "18000",
    source_url: "https://www.wordans.ca/gildan-18000-heavy-blend-fleece-crewneck-sweatshirt-222",
    asset_dir: File.join(ROOT, "frontend", "src", "assets", "clothing", "gildan-crewneck"),
    manifest_path: File.join(ROOT, "backend", "src", "main", "resources", "catalog", "gildan-18000-variants.json"),
    public_id_root: "thread-and-butter/clothing/gildan-18000",
    variants: [
      { slug: "black", name: "Black", supplier_slug: "black", hex: "#262629", file: "Gildan_18000_Heavy_Blend_Fleece_Crewneck_Sweatshirt_black.jpg" },
      { slug: "white", name: "White", supplier_slug: "white", hex: "#f6f5f2", file: "Gildan_18000_Heavy_Blend_Fleece_Crewneck_Sweatshirt_white.jpg" },
      { slug: "navy-blue", name: "Navy Blue", supplier_slug: "navy-blue", hex: "#27334a", file: "Gildan_18000_Heavy_Blend_Fleece_Crewneck_Sweatshirt_navy_blue.jpg" },
      { slug: "sport-grey", name: "Sport Grey", supplier_slug: "sport-grey", hex: "#a8a8a5", file: "Gildan_18000_Heavy_Blend_Fleece_Crewneck_Sweatshirt_sport_grey.jpg" },
      { slug: "charcoal", name: "Charcoal", supplier_slug: "charcoal", hex: "#505255", file: "Gildan_18000_Heavy_Blend_Fleece_Crewneck_Sweatshirt_charcoal.jpg" },
      { slug: "irish-green", name: "Irish Green", supplier_slug: "irish-green", hex: "#28824b", file: "Gildan_18000_Heavy_Blend_Fleece_Crewneck_Sweatshirt_irish_green.jpg" },
      { slug: "light-blue", name: "Light Blue", supplier_slug: "light-blue", hex: "#8db8d3", file: "Gildan_18000_Heavy_Blend_Fleece_Crewneck_Sweatshirt_light_blue.jpg" },
      { slug: "light-pink", name: "Light Pink", supplier_slug: "light-pink", hex: "#efb8c6", file: "Gildan_18000_Heavy_Blend_Fleece_Crewneck_Sweatshirt_light_pink.jpg" },
      { slug: "maroon", name: "Maroon", supplier_slug: "maroon", hex: "#5e2938", file: "Gildan_18000_Heavy_Blend_Fleece_Crewneck_Sweatshirt_maroon.jpg" },
      { slug: "sand", name: "Sand", supplier_slug: "sand", hex: "#c7b79c", file: "Gildan_18000_Heavy_Blend_Fleece_Crewneck_Sweatshirt_sand.jpg" },
      { slug: "gold", name: "Gold", supplier_slug: "gold", hex: "#dba62b", file: "Gildan_18000_Heavy_Blend_Fleece_Crewneck_Sweatshirt_gold.jpg" },
      { slug: "red", name: "Red", supplier_slug: "red", hex: "#c72d37", file: "Gildan_18000_Heavy_Blend_Fleece_Crewneck_Sweatshirt_red.jpg" },
      { slug: "purple", name: "Purple", supplier_slug: "purple", hex: "#533b70", file: "Gildan_18000_Heavy_Blend_Fleece_Crewneck_Sweatshirt_purple.jpg" },
      { slug: "orange", name: "Orange", supplier_slug: "orange", hex: "#ed7b2d", file: "Gildan_18000_Heavy_Blend_Fleece_Crewneck_Sweatshirt_orange.jpg" },
    ],
  },
  {
    style: "18200",
    source_url: "https://www.wordans.ca/gildan-18200-sweatpants-heavy-blend-comfortable-fit-25218",
    asset_dir: File.join(ROOT, "frontend", "src", "assets", "clothing", "gildan-sweatpant"),
    manifest_path: File.join(ROOT, "backend", "src", "main", "resources", "catalog", "gildan-18200-variants.json"),
    public_id_root: "thread-and-butter/clothing/gildan-18200",
    variants: [
      { slug: "black", name: "Black", supplier_slug: "black", hex: "#262629", file: "Gildan_18200_Sweatpants_Heavy_Blend_comfortable_fit_black.jpg" },
      { slug: "sport-grey", name: "Sport Grey", supplier_slug: "sport-grey", hex: "#a8a8a5", file: "Gildan_18200_Sweatpants_Heavy_Blend_comfortable_fit_sport_grey.jpg" },
      { slug: "navy-blue", name: "Navy Blue", supplier_slug: "navy-blue", hex: "#27334a", file: "Gildan_18200_Sweatpants_Heavy_Blend_comfortable_fit_navy_blue.jpg" },
      { slug: "ash", name: "Ash", supplier_slug: "ash", hex: "#d6d6d1", file: "Gildan_18200_Sweatpants_Heavy_Blend_comfortable_fit_ash.jpg" },
    ],
  },
].freeze

def load_env(path)
  return {} unless File.file?(path)

  File.readlines(path, chomp: true).each_with_object({}) do |line, values|
    next if line.strip.empty? || line.lstrip.start_with?("#") || !line.include?("=")

    key, value = line.split("=", 2)
    values[key.strip] = value.to_s.strip.gsub(/\A['"]|['"]\z/, "")
  end
end

def fetch_page(product)
  stdout, stderr, status = Open3.capture3(
    "curl", "--silent", "--show-error", "--fail-with-body", "--location", "--compressed",
    "--user-agent", "Mozilla/5.0 (compatible; ThreadAndButterCatalog/1.0)", product.fetch(:source_url),
  )
  raise "Could not fetch Wordans #{product.fetch(:style)} page: #{stderr} #{stdout}" unless status.success?

  stdout
end

def normalize_size(name)
  name == "XXL" ? "2XL" : name
end

def parse_variants(product, html)
  color_sizes_line = html.each_line.find { |line| line.start_with?("  COLOR_SIZES = ") }
  raise "COLOR_SIZES data was not found for Gildan #{product.fetch(:style)}" unless color_sizes_line

  color_sizes = JSON.parse(color_sizes_line.sub("  COLOR_SIZES = ", "").sub(/;\s*\z/, ""))
  supplier_by_slug = color_sizes.values.each_with_object({}) do |variant, values|
    values[variant.fetch("color").fetch("uri")] = variant
  end

  product.fetch(:variants).map do |config|
    supplier_variant = supplier_by_slug.fetch(config.fetch(:supplier_slug))
    sizes = supplier_variant.fetch("sizes")
      .select { |entry| entry.fetch("size").fetch("qty").to_i.positive? }
      .sort_by { |entry| entry.fetch("size").fetch("order") }
      .map { |entry| normalize_size(entry.fetch("size").fetch("name")) }

    {
      "id" => supplier_variant.fetch("color").fetch("id").to_s,
      "name" => config.fetch(:name),
      "slug" => config.fetch(:slug),
      "hex" => config.fetch(:hex),
      "image" => "#{product.fetch(:public_id_root)}/#{config.fetch(:slug)}",
      "localFilename" => config.fetch(:file),
      "sizes" => sizes,
    }
  end
end

def validate_images(product, variants)
  variants.each do |variant|
    path = File.join(product.fetch(:asset_dir), variant.fetch("localFilename"))
    raise "Local image is missing for #{variant.fetch('name')}: #{path}" unless File.file?(path)
    raise "Local image is empty for #{variant.fetch('name')}: #{path}" unless File.size?(path)
  end
end

def upload_images(product, variants, env)
  cloud_name = env.fetch("CLOUDINARY_CLOUD_NAME")
  api_key = env.fetch("CLOUDINARY_API_KEY")
  api_secret = env.fetch("CLOUDINARY_API_SECRET")
  endpoint = "https://api.cloudinary.com/v1_1/#{cloud_name}/image/upload"

  variants.each_with_index do |variant, index|
    timestamp = Time.now.to_i
    public_id = variant.fetch("image")
    signature = Digest::SHA1.hexdigest("overwrite=true&public_id=#{public_id}&timestamp=#{timestamp}#{api_secret}")
    path = File.join(product.fetch(:asset_dir), variant.fetch("localFilename"))

    stdout, stderr, status = Open3.capture3(
      "curl", "--silent", "--show-error", "--fail-with-body", "--request", "POST", endpoint,
      "--form", "file=@#{path}",
      "--form", "api_key=#{api_key}",
      "--form", "timestamp=#{timestamp}",
      "--form", "overwrite=true",
      "--form", "public_id=#{public_id}",
      "--form", "signature=#{signature}",
    )
    raise "Cloudinary upload failed for #{variant.fetch('name')}: #{stderr} #{stdout}" unless status.success?

    response = JSON.parse(stdout)
    raise "Unexpected Cloudinary ID for #{variant.fetch('name')}" unless response.fetch("public_id") == public_id

    puts format("Gildan %s [%2d/%2d] %s", product.fetch(:style), index + 1, variants.length, public_id)
  end
end

def write_manifest(product, variants)
  storefront_variants = variants.map { |variant| variant.reject { |key, _| key == "localFilename" } }
  File.write(product.fetch(:manifest_path), JSON.pretty_generate(storefront_variants) + "\n")
  puts "Wrote #{storefront_variants.length} variants to #{product.fetch(:manifest_path)}"
end

options = { upload: false, write_manifest: false }
OptionParser.new do |parser|
  parser.on("--upload", "Upload the provided colour images to Cloudinary") { options[:upload] = true }
  parser.on("--write-manifest", "Write customer-facing colour and size metadata") { options[:write_manifest] = true }
end.parse!

env = load_env(File.join(ROOT, "backend", ".env"))
PRODUCTS.each do |product|
  variants = parse_variants(product, fetch_page(product))
  validate_images(product, variants)
  puts "Gildan #{product.fetch(:style)}: #{variants.length} colour variants"
  upload_images(product, variants, env) if options[:upload]
  write_manifest(product, variants) if options[:write_manifest]
end
