#!/usr/bin/env ruby

require "digest"
require "json"
require "open3"

ROOT = File.expand_path("../..", __dir__)
ASSET_DIR = File.join(ROOT, "frontend", "src", "assets", "brand")

UPLOADS = {
  "one-piece-devil-fruit-embroidered-hoodie" => [
    "one_piece_fruit_of_the_devil_embroidered_hoodie_60.jpg",
  ],
  "one-piece-luffy-wanted-poster-embroidered-hoodie" => [
    "luffy_wanted_poster_one_piece_70_1.jpg",
    "luffy_wanted_poster_one_piece_70_2.jpg",
  ],
  "one-piece-zoro-panel-embroidered-hoodie" => [
    "one_piece_zoro_embroidered_hoodie_70.jpg",
  ],
  "attack-on-titan-eren-embroidered-hoodie" => [
    "aot_eren_embroidered_hoodie_70.jpg",
    "aot_eren_embroidered_hoodie_70_2.jpg",
  ],
  "demon-slayer-zenitsu-eyes-embroidered-hoodie" => [
    "demon_slayer_zenitsu_eyes_embroidered_hoodie_70.jpg",
  ],
  "hunter-x-hunter-kurapika-chain-embroidered-hoodie" => [
    "hunter_x_hunter_kurapika_embroidered_hoodie_70_1.jpg",
    "hunter_x_hunter_kurapika_embroidered_hoodie_70_2.jpg",
  ],
  "vinland-saga-no-enemies-embroidered-hoodie" => [
    "vinland_saga_embroidered_hoodie_70.jpg",
  ],
  "one-piece-to-be-continued-embroidered-hoodie" => [
    "one_piece_to_be_continued_embroidered_hoodie_70.jpg",
  ],
  "haikyuu-hinata-checkmark-embroidered-hoodie" => [
    "haikyuu_checkmark_embroidered_hoodie_70_1.jpg",
  ],
  "naruto-itachi-eye-panel-embroidered-hoodie" => [
    "naruto_itachi_embroidered_hoodie.jpg",
  ],
  "fullmetal-alchemist-edward-eyes-embroidered-hoodie" => [
    "fullmetal_alchemist_edward_eyes_embroidered_hoodie_70_1.jpg",
    "fullmetal_alchemist_edward_eyes_embroidered_hoodie_70_2.jpg",
  ],
  "fullmetal-alchemist-transmutation-circle-embroidered-crewneck" => [
    "Full_Metal_Alchemist_Transmutation_embroidered_crewneck_65_1.webp",
    "Full_Metal_Alchemist_Transmutation_embroidered_crewneck_65_2.webp",
  ],
  "fullmetal-alchemist-flamel-symbol-embroidered-hat" => [
    "fullmetal_alchemist_flamel_symbol_hat_50_1.webp",
    "fullmetal_alchemist_flamel_symbol_hat_50_2.webp",
    "fullmetal_alchemist_flamel_symbol_hat_50_3.webp",
  ],
  "fullmetal-alchemist-flamel-symbol-embroidered-hoodie" => [
    "Fullmetal_alchemist_Flamel_Embroidered_Hoodie_70_1.webp",
    "Fullmetal_alchemist_Flamel_Embroidered_Hoodie_70_2.webp",
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
