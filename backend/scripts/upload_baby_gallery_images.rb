#!/usr/bin/env ruby

require "digest"
require "json"
require "open3"

ROOT = File.expand_path("../..", __dir__)
ASSET_DIR = File.join(ROOT, "frontend", "src", "assets", "brand")

UPLOADS = {
  "personalized-knit-baby-blanket" => [
    "Personalized_Organic_Cotton_Knit_Baby_Blanket_Embroidered_Name_Keepsake_40_1.webp",
    "Personalized_Organic_Cotton_Knit_Baby_Blanket_Embroidered_Name_Keepsake_40_2.webp",
  ],
  "little-goose-embroidered-baby-romper" => [
    "little_goose_embroidery_baby_crewneck_60_1.webp",
    "little_goose_embroidery_baby_crewneck_60_2.webp",
  ],
  "aunties-favorite-silly-goose-baby-romper" => [
    "Auntie's_Favorite_Silly_Goose_Embroidered_Baby_Romper_40_1.webp",
    "Auntie's_Favorite_Silly_Goose_Embroidered_Baby_Romper_40_2.webp",
  ],
  "personalized-name-ribbed-baby-footie" => [
    "Personalized_Baby_Name_Embroidered_Romper_Organic_Cotton_Ribbed_Footie_Jumpsuit_35_1.avif",
  ],
  "where-mommy-goes-duck-baby-bodysuit" => [
    "I_Go_Where_Mommy_Goes_Romper_Duck_Baby_Outfit_Embroidered_Baby_Bodysuit_40_1.jpg",
    "I_Go_Where_Mommy_Goes_Romper_Duck_Baby_Outfit_Embroidered_Baby_Bodysuit_40_2.jpg",
  ],
  "silly-goose-on-the-loose-baby-romper" => [
    "funny_Silly_Goose_on_the_loose_Baby_Romper_40_1.webp",
    "funny_Silly_Goose_on_the_loose_Baby_Romper_40_2.webp",
  ],
  "hear-me-roar-lion-baby-romper" => [
    "hear_me_roar_Baby_Romper_40_1.webp",
    "hear_me_roar_Baby_Romper_40_2.webp",
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
