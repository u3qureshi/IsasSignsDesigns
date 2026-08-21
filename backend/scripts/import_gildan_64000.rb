#!/usr/bin/env ruby

require "cgi"
require "digest"
require "fileutils"
require "json"
require "open3"
require "optparse"
require "uri"

ROOT = File.expand_path("../..", __dir__)
SOURCE_URL = "https://www.wordans.ca/gildan-64000-softstyle-t-shirt-for-men-and-women-comfortable-and-durable-25344/c195-natural"
ASSET_DIR = File.join(ROOT, "frontend", "src", "assets", "clothing", "gildan-64000")
MANIFEST_PATH = File.join(ROOT, "backend", "src", "main", "resources", "catalog", "gildan-64000-variants.json")
PUBLIC_ID_ROOT = "thread-and-butter/clothing/gildan-64000"

NAME_OVERRIDES = {
  "Hth Military Grn" => "Heather Military Green",
  "Navy blue" => "Navy Blue",
  "Cherry red" => "Cherry Red",
  "Lime green" => "Lime Green",
}.freeze

# The supplier page occasionally returns swatch values that belong to a
# neighbouring colour. Keep a curated storefront palette so the selector is a
# useful visual preview while the product photograph remains authoritative.
SWATCH_OVERRIDES = {
  "Black" => "#242424",
  "Navy Blue" => "#28344a",
  "Sport Grey" => "#a6a6a6",
  "White" => "#f4f4f2",
  "Dark Heather" => "#474b4e",
  "Heather Navy" => "#34495e",
  "Royal" => "#2855a5",
  "Natural" => "#eadfc8",
  "Charcoal" => "#555759",
  "Heather Military Green" => "#626852",
  "Orange" => "#ed7b2c",
  "Maroon" => "#5d2837",
  "Indigo Blue" => "#365c78",
  "Heather Red" => "#b64b52",
  "Military Green" => "#555c38",
  "Graphite Heather" => "#626264",
  "Heather Orange" => "#d87948",
  "Heather Royal" => "#4b6eaa",
  "Red" => "#c62d35",
  "Heather Sapphire" => "#3f899e",
  "Sapphire" => "#178cab",
  "Irish Green" => "#28824b",
  "Heather Irish Green" => "#4b8a65",
  "Light Blue" => "#8db8d3",
  "Forest Green" => "#294f3c",
  "Antique Cherry Red" => "#873b49",
  "Heather Purple" => "#655372",
  "Purple" => "#533b70",
  "Cardinal Red" => "#8d2939",
  "Sand" => "#c4b398",
  "Daisy" => "#f3c62e",
  "Cherry Red" => "#a9273d",
  "Heather Indigo" => "#536876",
  "Heather Maroon" => "#70404d",
  "Dark Chocolate" => "#49352e",
  "Metro Blue" => "#2d416b",
  "Jade Dome" => "#255c59",
  "Carolina Blue" => "#6898c3",
  "Antique Sapphire" => "#397d8c",
  "Lime Green" => "#a6cb58",
  "Heather Cardinal" => "#84424f",
  "Cornsilk" => "#efde8b",
  "Kiwi" => "#7b9b4b",
}.freeze

# Wordans currently supplies a model-only image for this colour. Keep it out of
# the storefront until an isolated product image is available.
EXCLUDED_COLOR_IDS = ["2767"].freeze

def load_env(path)
  return {} unless File.exist?(path)

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
  colors_by_id = color_sizes.each_with_object({}) do |(id, variant), colors|
    colors[id.to_s] = variant.fetch("color")
  end
  page_order = html.scan(/selectColor\(\{(?:&quot;)?id(?:&quot;)?\s*:\s*(\d+)/).flatten
  saved_order = if File.file?(MANIFEST_PATH)
    JSON.parse(File.read(MANIFEST_PATH)).map { |variant| variant.fetch("id").to_s }
  else
    []
  end
  ordered_ids = (saved_order + page_order + colors_by_id.keys).uniq
  ordered_colors = ordered_ids.filter { |id| colors_by_id.key?(id) }.map { |id| colors_by_id.fetch(id) }
  raise "Expected 44 colours, found #{ordered_colors.length}" unless ordered_colors.length == 44
  ordered_colors = ordered_colors.reject do |color|
    EXCLUDED_COLOR_IDS.include?(color.fetch("id").to_s)
  end

  ordered_colors.map do |color|
    supplier_variant = color_sizes.fetch(color.fetch("id").to_s)
    slug = color.fetch("uri")
    display_name = NAME_OVERRIDES.fetch(color.fetch("name"), color.fetch("name"))
    extension = File.extname(URI.parse(color.fetch("img_original")).path).downcase
    extension = ".png" unless [".jpg", ".jpeg", ".png", ".webp"].include?(extension)
    {
      "id" => color.fetch("id").to_s,
      "name" => display_name,
      "slug" => slug,
      "hex" => SWATCH_OVERRIDES.fetch(display_name, color.fetch("hex_code")),
      "image" => "#{PUBLIC_ID_ROOT}/#{slug}",
      "sourceImage" => color.fetch("img_original"),
      "localFilename" => "#{slug}#{extension}",
      "sizes" => supplier_variant.fetch("sizes")
        .select { |entry| entry.fetch("size").fetch("qty").to_i.positive? }
        .sort_by { |entry| entry.fetch("size").fetch("order") }
        .map { |entry| entry.fetch("size").fetch("name") },
    }
  end
end

def download_images(variants)
  FileUtils.mkdir_p(ASSET_DIR)
  variants.each_with_index do |variant, index|
    destination = File.join(ASSET_DIR, variant.fetch("localFilename"))
    stdout, stderr, status = Open3.capture3(
      "curl", "--silent", "--show-error", "--fail-with-body", "--location",
      "--user-agent", "Mozilla/5.0 (compatible; ThreadAndButterCatalog/1.0)",
      "--output", destination, variant.fetch("sourceImage"),
    )
    raise "Download failed for #{variant.fetch('name')}: #{stderr} #{stdout}" unless status.success?
    raise "Downloaded an empty file for #{variant.fetch('name')}" unless File.size?(destination)

    puts format("Downloaded [%2d/%2d] %s", index + 1, variants.length, variant.fetch("name"))
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
    raise "Local image is missing for #{variant.fetch('name')}: #{path}" unless File.file?(path)

    stdout, stderr, status = Open3.capture3(
      "curl", "--silent", "--show-error", "--fail-with-body", "--request", "POST", endpoint,
      "--form", "file=@\"#{path}\"",
      "--form", "api_key=#{api_key}",
      "--form", "timestamp=#{timestamp}",
      "--form", "overwrite=true",
      "--form", "public_id=#{public_id}",
      "--form", "signature=#{signature}",
    )
    raise "Cloudinary upload failed for #{variant.fetch('name')}: #{stderr} #{stdout}" unless status.success?
    response = JSON.parse(stdout)
    raise "Unexpected Cloudinary ID for #{variant.fetch('name')}" unless response.fetch("public_id") == public_id

    puts format("Uploaded   [%2d/%2d] %s", index + 1, variants.length, public_id)
  end
end

def write_manifest(variants)
  FileUtils.mkdir_p(File.dirname(MANIFEST_PATH))
  storefront_variants = variants.map do |variant|
    variant.reject { |key, _| ["sourceImage", "localFilename"].include?(key) }
  end
  File.write(MANIFEST_PATH, JSON.pretty_generate(storefront_variants) + "\n")
  puts "Wrote #{storefront_variants.length} variants to #{MANIFEST_PATH}"
end

options = { download: false, upload: false, write_manifest: false }
OptionParser.new do |parser|
  parser.on("--download", "Download the isolated front image for every colour") { options[:download] = true }
  parser.on("--upload", "Upload downloaded colour images to Cloudinary") { options[:upload] = true }
  parser.on("--write-manifest", "Write customer-facing colour and size metadata") { options[:write_manifest] = true }
end.parse!

variants = parse_variants(fetch_page)
puts "Gildan 64000: #{variants.length} colour variants"
download_images(variants) if options[:download]
upload_images(variants, load_env(File.join(ROOT, "backend", ".env"))) if options[:upload]
write_manifest(variants) if options[:write_manifest]
