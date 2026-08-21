#!/usr/bin/env ruby

require "digest"
require "json"
require "open3"
require "optparse"

ROOT = File.expand_path("../..", __dir__)
SOURCE_URL = "https://www.wordans.ca/gildan-18500-heavy-blend-fleece-hooded-sweatshirt-25233"
ASSET_DIR = File.join(ROOT, "frontend", "src", "assets", "clothing", "gildan-heavyweight-hoodies")
MANIFEST_PATH = File.join(ROOT, "backend", "src", "main", "resources", "catalog", "gildan-18500-variants.json")
PUBLIC_ID_ROOT = "thread-and-butter/clothing/gildan-18500"

VARIANT_CONFIGS = [
  { slug: "black", name: "Black", supplier_slug: "black", hex: "#262629", file: "Gildan_18500_Heavy_Blend_Fleece_Hoodie_black.jpg" },
  { slug: "white", name: "White", supplier_slug: "white", hex: "#f6f5f2", file: "Gildan_18500_Heavy_Blend_Fleece_Hoodie_white.jpg" },
  { slug: "navy-blue", name: "Navy Blue", supplier_slug: "navy-blue", hex: "#27334a", file: "Gildan_18500_Heavy_Blend_Fleece_Hoodie_navy_blue.jpg" },
  { slug: "sport-grey", name: "Sport Grey", supplier_slug: "sport-grey", hex: "#a8a8a5", file: "Gildan_18500_Heavy_Blend_Fleece_Hoodie_sport_grey.jpg" },
  { slug: "charcoal", name: "Charcoal", supplier_slug: "charcoal", hex: "#505255", file: "Gildan_18500_Heavy_Blend_Fleece_Hoodie_charcoal.jpg" },
  { slug: "forest-green", name: "Forest Green", supplier_slug: "forest", hex: "#294f3c", file: "Gildan_18500_Heavy_Blend_Fleece_Hoodie_forest_green.jpg" },
  { slug: "military-green", name: "Military Green", supplier_slug: "military-green", hex: "#596044", file: "Gildan_18500_Heavy_Blend_Fleece_Hoodie_military_green.jpg" },
  { slug: "maroon", name: "Maroon", supplier_slug: "maroon", hex: "#5e2938", file: "Gildan_18500_Heavy_Blend_Fleece_Hoodie_maroon.jpg" },
  { slug: "dark-chocolate", name: "Dark Chocolate", supplier_slug: "dark-chocolate", hex: "#4a352d", file: "Gildan_18500_Heavy_Blend_Fleece_Hoodie_chocolate.jpg" },
  { slug: "sand", name: "Sand", supplier_slug: "sand", hex: "#c7b79c", file: "Gildan_18500_Heavy_Blend_Fleece_Hoodie_sand.jpg" },
  { slug: "light-pink", name: "Light Pink", supplier_slug: "light-pink", hex: "#efb8c6", file: "Gildan_18500_Heavy_Blend_Fleece_Hoodie_light_pink.jpg" },
  { slug: "red", name: "Red", supplier_slug: "red", hex: "#c72d37", file: "Gildan_18500_Heavy_Blend_Fleece_Hoodie_red.jpg" },
  { slug: "royal-blue", name: "Royal Blue", supplier_slug: "royal-blue", hex: "#2d57a7", file: "Gildan_18500_Heavy_Blend_Fleece_Hoodie_royal_blue.jpg" },
  { slug: "purple", name: "Purple", supplier_slug: "purple", hex: "#533b70", file: "Gildan_18500_Heavy_Blend_Fleece_Hoodie_purple.jpg" },
  { slug: "orange", name: "Orange", supplier_slug: "orange", hex: "#ed7b2d", file: "Gildan_18500_Heavy_Blend_Fleece_Hoodie_orange.jpg" },
  { slug: "safety-orange", name: "Safety Orange", supplier_slug: "s-orange", hex: "#f36c30", file: "Gildan_18500_Heavy_Blend_Fleece_Hoodie_safety_orange.jpg" },
].freeze

def load_env(path)
  return {} unless File.file?(path)

  File.readlines(path, chomp: true).each_with_object({}) do |line, values|
    next if line.strip.empty? || line.lstrip.start_with?("#") || !line.include?("=")

    key, value = line.split("=", 2)
    values[key.strip] = value.to_s.strip.gsub(/\A['"]|['"]\z/, "")
  end
end

def fetch_page
  stdout, stderr, status = Open3.capture3(
    "curl", "--silent", "--show-error", "--fail-with-body", "--location", "--compressed",
    "--user-agent", "Mozilla/5.0 (compatible; ThreadAndButterCatalog/1.0)", SOURCE_URL,
  )
  raise "Could not fetch Wordans product page: #{stderr} #{stdout}" unless status.success?

  stdout
end

def parse_variants(html)
  color_sizes_line = html.each_line.find { |line| line.start_with?("  COLOR_SIZES = ") }
  raise "COLOR_SIZES data was not found on the supplier page" unless color_sizes_line

  color_sizes = JSON.parse(color_sizes_line.sub("  COLOR_SIZES = ", "").sub(/;\s*\z/, ""))
  supplier_by_slug = color_sizes.values.each_with_object({}) do |variant, values|
    values[variant.fetch("color").fetch("uri")] = variant
  end

  VARIANT_CONFIGS.map do |config|
    supplier_variant = supplier_by_slug.fetch(config.fetch(:supplier_slug))
    sizes = supplier_variant.fetch("sizes")
      .select { |entry| entry.fetch("size").fetch("qty").to_i.positive? }
      .sort_by { |entry| entry.fetch("size").fetch("order") }
      .map { |entry| entry.fetch("size").fetch("name") }

    {
      "id" => supplier_variant.fetch("color").fetch("id").to_s,
      "name" => config.fetch(:name),
      "slug" => config.fetch(:slug),
      "hex" => config.fetch(:hex),
      "image" => "#{PUBLIC_ID_ROOT}/#{config.fetch(:slug)}",
      "localFilename" => config.fetch(:file),
      "sizes" => sizes,
    }
  end
end

def validate_images(variants)
  variants.each do |variant|
    path = File.join(ASSET_DIR, variant.fetch("localFilename"))
    raise "Local image is missing for #{variant.fetch('name')}: #{path}" unless File.file?(path)
    raise "Local image is empty for #{variant.fetch('name')}: #{path}" unless File.size?(path)
  end
end

def upload_images(variants, env)
  cloud_name = env.fetch("CLOUDINARY_CLOUD_NAME")
  api_key = env.fetch("CLOUDINARY_API_KEY")
  api_secret = env.fetch("CLOUDINARY_API_SECRET")
  endpoint = "https://api.cloudinary.com/v1_1/#{cloud_name}/image/upload"

  variants.each_with_index do |variant, index|
    timestamp = Time.now.to_i
    public_id = variant.fetch("image")
    signature = Digest::SHA1.hexdigest("overwrite=true&public_id=#{public_id}&timestamp=#{timestamp}#{api_secret}")
    path = File.join(ASSET_DIR, variant.fetch("localFilename"))

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

    puts format("Uploaded [%2d/%2d] %s", index + 1, variants.length, public_id)
  end
end

def write_manifest(variants)
  storefront_variants = variants.map { |variant| variant.reject { |key, _| key == "localFilename" } }
  File.write(MANIFEST_PATH, JSON.pretty_generate(storefront_variants) + "\n")
  puts "Wrote #{storefront_variants.length} variants to #{MANIFEST_PATH}"
end

options = { upload: false, write_manifest: false }
OptionParser.new do |parser|
  parser.on("--upload", "Upload the provided colour images to Cloudinary") { options[:upload] = true }
  parser.on("--write-manifest", "Write customer-facing colour and size metadata") { options[:write_manifest] = true }
end.parse!

variants = parse_variants(fetch_page)
validate_images(variants)
puts "Gildan 18500: #{variants.length} colour variants"
upload_images(variants, load_env(File.join(ROOT, "backend", ".env"))) if options[:upload]
write_manifest(variants) if options[:write_manifest]
