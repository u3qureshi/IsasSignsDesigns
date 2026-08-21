#!/usr/bin/env ruby

require "digest"
require "fileutils"
require "json"
require "open3"
require "optparse"

ROOT = File.expand_path("../..", __dir__)
SOURCE_URL = "https://www.wordans.ca/gildan-g200-ultra-durable-cotton-comfort-tee-11182"
ASSET_DIR = File.join(ROOT, "frontend", "src", "assets", "clothing", "gildan-g200")
MANIFEST_PATH = File.join(ROOT, "backend", "src", "main", "resources", "catalog", "gildan-g200-variants.json")
PUBLIC_ID_ROOT = "thread-and-butter/clothing/gildan-g200"
ISOLATED_IMAGE_ROOT = "https://flare.fullsource.com/images/items/e/raw"

NAME_OVERRIDES = {
  "Cherry red" => "Cherry Red",
  "Lime green" => "Lime Green",
  "Navy blue" => "Navy Blue",
  "Royal blue" => "Royal Blue",
}.freeze

SWATCH_OVERRIDES = {
  "Antique Cherry Red" => "#873b49",
  "Antique Royal" => "#344d82",
  "Ash Grey" => "#d6d6d1",
  "Azalea" => "#d94f85",
  "Black" => "#242424",
  "Blue Dusk" => "#3d4f5c",
  "Cardinal Red" => "#8d2939",
  "Carolina Blue" => "#6898c3",
  "Charcoal" => "#555759",
  "Cherry Red" => "#a9273d",
  "Daisy" => "#f3c62e",
  "Dark Heather" => "#474b4e",
  "Forest Green" => "#294f3c",
  "Galapagos Blue" => "#4d7775",
  "Gold" => "#dba62b",
  "Heather Cardinal" => "#84424f",
  "Heather Indigo" => "#536876",
  "Heather Navy" => "#34495e",
  "Heather Sapphire" => "#3f899e",
  "Heliconia" => "#d62b70",
  "Ice Grey" => "#c5c7c6",
  "Indigo Blue" => "#365c78",
  "Iris" => "#5b6fae",
  "Irish Green" => "#28824b",
  "Jade Dome" => "#255c59",
  "Kelly Green" => "#278047",
  "Light Blue" => "#8db8d3",
  "Light Pink" => "#efb7c6",
  "Lime Green" => "#a6cb58",
  "Maroon" => "#5d2837",
  "Metro Blue" => "#2d416b",
  "Military Green" => "#555c38",
  "Mint Green" => "#8ec2a0",
  "Natural" => "#eadfc8",
  "Navy Blue" => "#28344a",
  "Orange" => "#ed7b2c",
  "Orchid" => "#aa75a8",
  "Purple" => "#533b70",
  "Red" => "#c62d35",
  "Royal Blue" => "#2855a5",
  "Safety Green" => "#c2d82e",
  "Safety Orange" => "#f36b2f",
  "Safety Pink" => "#f4518a",
  "Sand" => "#c4b398",
  "Sapphire" => "#178cab",
  "Sky" => "#74b9d2",
  "Sport Grey" => "#a6a6a6",
  "Stone Blue" => "#71899a",
  "Tan" => "#b29572",
  "Tangerine" => "#df6f39",
  "Texas Orange" => "#9d4b35",
  "White" => "#f4f4f2",
}.freeze

ISOLATED_IMAGE_NAME_OVERRIDES = {
  "heather-cardinal" => "2000-Heathered-Cardinal-E4.jpg",
  "heather-indigo" => "2000_HeatheredIndigo_4_A.jpg",
  "heather-navy" => "2000-Heathered-Navy-E4.jpg",
  "heather-sapphire" => "2000-Heathered-Sapphire-E4.jpg",
  "lime-green" => "2000-Lime-E4.jpg",
  "navy-blue" => "2000-Navy-E4.jpg",
  "royal-blue" => "2000-Royal-E4.jpg",
  "safety-orange" => "2000-S-Orange-E4.jpg",
}.freeze

# Add a supplier colour ID here if its primary photograph includes a model.
EXCLUDED_COLOR_IDS = [].freeze
PREFERRED_COLOR_IDS = ["20", "23"].freeze

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
  colors_by_id = color_sizes.each_with_object({}) do |(id, variant), colors|
    colors[id.to_s] = variant.fetch("color")
  end
  page_order = html.scan(/selectColor\(\{(?:&quot;)?id(?:&quot;)?\s*:\s*(\d+)/).flatten
  saved_order = if File.file?(MANIFEST_PATH)
    JSON.parse(File.read(MANIFEST_PATH)).map { |variant| variant.fetch("id").to_s }
  else
    []
  end
  ordered_ids = (PREFERRED_COLOR_IDS + saved_order + page_order + colors_by_id.keys).uniq
  ordered_colors = ordered_ids.filter { |id| colors_by_id.key?(id) }.map { |id| colors_by_id.fetch(id) }
  raise "Expected 52 colours, found #{ordered_colors.length}" unless ordered_colors.length == 52

  ordered_colors.reject { |color| EXCLUDED_COLOR_IDS.include?(color.fetch("id").to_s) }.map do |color|
    supplier_variant = color_sizes.fetch(color.fetch("id").to_s)
    display_name = NAME_OVERRIDES.fetch(color.fetch("name"), color.fetch("name"))
    slug = color.fetch("uri")
    isolated_filename = ISOLATED_IMAGE_NAME_OVERRIDES.fetch(
      slug,
      "2000-#{slug.split('-').map(&:capitalize).join('-')}-E4.jpg",
    )

    {
      "id" => color.fetch("id").to_s,
      "name" => display_name,
      "slug" => slug,
      "hex" => SWATCH_OVERRIDES.fetch(display_name, color.fetch("hex_code")),
      "image" => "#{PUBLIC_ID_ROOT}/#{slug}",
      "sourceImage" => "#{ISOLATED_IMAGE_ROOT}/#{isolated_filename}",
      "localFilename" => "#{slug}.jpg",
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
puts "Gildan G200: #{variants.length} colour variants"
download_images(variants) if options[:download]
upload_images(variants, load_env(File.join(ROOT, "backend", ".env"))) if options[:upload]
write_manifest(variants) if options[:write_manifest]
