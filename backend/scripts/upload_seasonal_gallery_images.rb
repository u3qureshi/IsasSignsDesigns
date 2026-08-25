#!/usr/bin/env ruby

require "digest"
require "json"
require "net/http"
require "open3"

ROOT = File.expand_path("../..", __dir__)
ASSET_DIR = File.join(ROOT, "frontend", "src", "assets", "brand")

UPLOADS = {
  "always-cold-embroidered-hoodie" => [
    "always_cold_embroidered_hoodie_60_1.webp",
    "always_cold_embroidered_hoodie_60_2.webp",
  ],
  "black-cat-broomstick-embroidered-crewneck" => [
    "Embroidered_Black_Cat_Broomstick_60_1.webp",
  ],
  "cozy-season-autumn-embroidered-crewneck" => [
    "autumn_cozy_season_embroidered_hoodie_60_1.webp",
    "autumn_cozy_season_embroidered_hoodie_60_2.webp",
  ],
  "spooky-goose-costume-parade-embroidered-crewneck" => [
    "autumn_spooky_goose_crewneck_60_1.webp",
    "autumn_spooky_goose_crewneck_60_2.webp",
    "autumn_spooky_goose_crewneck_60_3.webp",
  ],
  "autumn-spooky-goose-embroidered-hoodie" => [
    "autumn_spooky_goose_crewneck_type2_60_1.webp",
  ],
  "in-my-cozy-era-embroidered-sweatshirt" => [
    "in_my_cozy_era_sweatshirt_hoodie_crewneck_60_1.webp",
    "in_my_cozy_era_sweatshirt_hoodie_crewneck_60_2.webp",
  ],
  "winter-cardinal-embroidered-crewneck" => [
    "winter_cardinal_snow_crewneck_60_1.webp",
    "winter_cardinal_snow_crewneck_60_2.webp",
  ],
  "winter-hockey-geese-embroidered-crewneck" => [
    "winter_hockey_goose_crewneck_60_1.avif",
  ],
}.freeze

def load_env(path)
  File.readlines(path, chomp: true).each_with_object({}) do |line, values|
    next if line.strip.empty? || line.lstrip.start_with?("#") || !line.include?("=")

    key, value = line.split("=", 2)
    values[key.strip] = value.to_s.strip.gsub(/\A['"]|['"]\z/, "")
  end
end

env = load_env(File.join(ROOT, "backend", ".env"))
cloud_name = env.fetch("CLOUDINARY_CLOUD_NAME")
api_key = env.fetch("CLOUDINARY_API_KEY")
api_secret = env.fetch("CLOUDINARY_API_SECRET")
endpoint = "https://api.cloudinary.com/v1_1/#{cloud_name}/image/upload"

images = UPLOADS.flat_map do |slug, filenames|
  filenames.map.with_index do |filename, index|
    [filename, "thread-and-butter/gallery/#{slug}/image-#{index + 1}"]
  end
end

images.each_with_index do |(filename, public_id), index|
  path = File.join(ASSET_DIR, filename)
  raise "Missing image: #{path}" unless File.file?(path)

  timestamp = Time.now.to_i
  signature_source = "overwrite=true&public_id=#{public_id}&timestamp=#{timestamp}#{api_secret}"
  signature = Digest::SHA1.hexdigest(signature_source)
  stdout, stderr, status = Open3.capture3(
    "curl", "--silent", "--show-error", "--fail-with-body", "-X", "POST", endpoint,
    "-F", "file=@#{path}",
    "-F", "api_key=#{api_key}",
    "-F", "timestamp=#{timestamp}",
    "-F", "overwrite=true",
    "-F", "public_id=#{public_id}",
    "-F", "signature=#{signature}",
  )
  raise "Cloudinary upload failed for #{filename}: #{stderr} #{stdout}" unless status.success?

  response = JSON.parse(stdout)
  raise "Unexpected Cloudinary public ID for #{filename}" unless response["public_id"] == public_id

  puts format("[%2d/%2d] %s", index + 1, images.length, public_id)
end
