#!/usr/bin/env ruby

require "digest"
require "json"
require "open3"

ROOT = File.expand_path("../..", __dir__)
VIDEO_DIR = File.join(ROOT, "frontend", "src", "assets", "gifs")
VIDEOS = {
  "embroidery_edit.web.mp4" => "thread-and-butter/home/embroidery-showcase",
  "printing_edit.web.mp4" => "thread-and-butter/home/printing-showcase",
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
endpoint = "https://api.cloudinary.com/v1_1/#{cloud_name}/video/upload"

VIDEOS.each_with_index do |(filename, public_id), index|
  path = File.join(VIDEO_DIR, filename)
  raise "Missing video: #{path}" unless File.file?(path)

  timestamp = Time.now.to_i
  signature = Digest::SHA1.hexdigest(
    "overwrite=true&public_id=#{public_id}&timestamp=#{timestamp}#{api_secret}",
  )
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
  puts format("[%d/%d] %s (%0.1f MB)", index + 1, VIDEOS.length, public_id, response.fetch("bytes") / 1_048_576.0)
end
