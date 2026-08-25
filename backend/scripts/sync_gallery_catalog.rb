#!/usr/bin/env ruby

require "digest"
require "json"
require "net/http"
require "optparse"
require "open3"
require "time"
require "uri"

ROOT = File.expand_path("../..", __dir__)
ASSET_DIR = File.join(ROOT, "frontend", "src", "assets", "brand")
MIGRATION_PATH = File.join(
  ROOT,
  "backend",
  "src",
  "main",
  "resources",
  "db",
  "migration",
  "V7__gallery_products.sql",
)

TITLE_OVERRIDES = {
  "Custom_Dad_Embroidered_Hoodie_Name_On_Sleeve_with_Heart_Daddy_Est_Year_Hoodie_with_Date_Personalized_Gift_for_New_Dad_Fathers_Day_Gift" => "Personalized Daddy Est. Embroidered Hoodie",
  "Custom_Embroidered_Anniversary_Hoodie_with_Date_Pinky_Promise_Matching_Hoodies_Personalized_Valentines_Day_Gift_for_Her_Him" => "Pinky Promise Anniversary Hoodie Set",
  "Custom_Embroidered_Couples_Matching_Hoodies_and_Sweatpants_Mr_Mrs_Outfits" => "Mr. & Mrs. Embroidered Couples Set",
  "Custom_Embroidered_Dad_and_grandpa_Sweatshirt_Father's_Day_Gift" => "Personalized Dad or Grandpa Embroidered Sweatshirt",
  "Custom_Embroidered_PAPA_Sweatshirt,Grandpa_Shirt_With_Date_Daddy_Est_Year_Shirt_Custom_Dad_Est_Hoodie_Gift_For_New_Dad_Father's_Day_Gift" => "Personalized Papa Est. Embroidered Sweatshirt",
  "Custom_Embroidered_Roman_Numeral_Hoodie_Personalized_Couple_Gift" => "Personalized Roman Numeral Hoodie",
  "Dad_Forest_Embroidered_hoodie" => "Dad Forest Embroidered Hoodie",
  "Embroidered_Dad_Sweatshirt_Custom_Kids_Names_Sleeve_Father's_Day_Gift" => "Dad Names-on-Sleeve Embroidered Sweatshirt",
  "Embroidered_Mama_cursive_Sweatshirt_Personalized_Kid_Names_Sleeve_Mother's_Day_Gift" => "Cursive Mama Names-on-Sleeve Sweatshirt",
  "Embroidered_Tiger_Hoodie" => "Tiger Embroidered Hoodie",
  "Floral_Grandma_Quarter_Zip_Personalized_Embroidered_Grandma_Sweatshirt_Wildflower_Grandmother_Pullover_Gift_from_Grandkids_Grandma_Gift" => "Floral Grandma Embroidered Quarter-Zip",
  "Duck_And_Daisy_Embroidered_Crewneck" => "Duck & Daisy Embroidered Crewneck",
  "Hunter_x_hunter_embroidered_hoodie" => "Hunter × Hunter Embroidered Hoodie",
  "I_have_stability_funny_duck_tshirt" => "I Have Stability Duck T-Shirt",
  "Pain_naruto_embroidered_hoodie" => "Pain-Inspired Embroidered Hoodie",
  "Personalized_Dad_Embroidered_Sweatshirt_Custom_Mama_Hoodie_With_Kids_Names_On_Sleeve_Matching_Mom_&_Dad_Outfits_Baby_Announcement_Gifts_set" => "Personalized Mama & Dad Matching Sweatshirt Set",
  "Personalized_Embroidered_Mama_Sweatshirt_Floral_Mama_Crewneck_Christmas_Gift_for_Mom_New_Mom_Gift_Custom_Sleeve_Name" => "Floral Mama Personalized Crewneck",
  "Personalized_Mama_Sweatshirt_with_Kids_Names_Custom_Mom_Embroidered_Crewneck_Mother's_Day_Gift" => "Mama Kids' Names Embroidered Crewneck",
  "Personalized_Papa_Bear_Crewneck_Sweatshirt_Custom_Dad_Sweatshirt_with_Kids_Names_Custom_Shirt_for_Dad_Fathers_Day_Gift_For_Husband" => "Papa Bear Personalized Crewneck",
  "Personalized_Papa_Crewneck_Sweatshirt_Custom_Papa_Shirt_With_Kids_Names_On_Sleeve_Fathers_Day_Gift_For_Dad_Gift_For_Husband" => "Papa Names-on-Sleeve Crewneck",
  "Sukuna_large_embroidered_Hoodie" => "Sukuna-Inspired Large Embroidered Hoodie",
  "The_Yapper_and_The_Listener_Couple_Hoodies,_Custom_Embroidered_Matching_Valentine's_Gift_for_Him_and_Her" => "Yapper & Listener Matching Hoodie Set",
  "Uchiha_Clan_design_embroidered_hoodie" => "Uchiha-Inspired Embroidered Hoodie",
  "Wifey_Hubby_Embroidered_Sweatshirt_Custom_Wifey_Sweatshirt_Personalized_Wedding_Gift_Custom_Couple_Initials_Mrs_Sweatshirt" => "Wifey & Hubby Personalized Sweatshirt Set",
  "attack_on_titan_back_embroidered_hoodie" => "Attack on Titan-Inspired Back Embroidered Hoodie",
  "attack_on_titan_beyond_the_wall_embroidered_hoodie" => "Beyond the Wall Embroidered Hoodie",
  "attack_on_titan_levi_embroidered_hoodie" => "Levi-Inspired Embroidered Hoodie",
  "attack_on_titan_printed_hoodie" => "Attack on Titan-Inspired Printed Hoodie",
  "bleach_bankai_embroidered_hoodie" => "Bankai-Inspired Embroidered Hoodie",
  "bonsai_embroidered_crewneck" => "Bonsai Embroidered Crewneck",
  "cartoon_swimming_cat_tshirt" => "Swimming Cat T-Shirt",
  "cat_mom_printed_tshirt" => "Cat Mom Printed T-Shirt",
  "death_note_printed_tshirt_L" => "L-Inspired Printed T-Shirt",
  "dragon_ball_z_goku_embroidered_hoodie" => "Goku-Inspired Embroidered Hoodie",
  "embroidered_hat_dragonball_z_symbol" => "Dragon Ball-Inspired Symbol Hat",
  "embroidered_hat_fairy_tail_symbol" => "Fairy Tail-Inspired Symbol Hat",
  "embroidered_hat_naruto_akatsuki_checkmark_symbol" => "Akatsuki-Inspired Symbol Hat",
  "embroidered_hat_naruto_leaf_rogue_symbol" => "Rogue Leaf-Inspired Symbol Hat",
  "embroidered_hat_naruto_uchiha_symbol" => "Uchiha-Inspired Symbol Hat",
  "embroidered_hat_one_piece_straw_hat_symbol" => "Straw Hat-Inspired Embroidered Cap",
  "funny_cat_if_you_need_me_dont_tshirt" => "If You Need Me, Don't Cat T-Shirt",
  "funny_goose_mothers_day_printed_tshirt" => "Mother's Day Goose T-Shirt",
  "goosebumps_embroidered_hat" => "Goosebumps-Inspired Embroidered Hat",
  "houston_i_have_so_many_problems_raccoon_tshirt" => "Houston, I Have So Many Problems T-Shirt",
  "hunter_x_hunter_gon_killua_printed_tshirt" => "Gon & Killua-Inspired Printed T-Shirt",
  "hunter_x_hunter_killua_embroidered_hoodie" => "Killua-Inspired Embroidered Hoodie",
  "i_have_stability_funny_duck_embroidered_crewneck" => "I Have Stability Duck Embroidered Crewneck",
  "if_i_shenan_once_i'll_shenanigan_shirt_pigeon_t_shirt" => "If I Shenan Once Pigeon T-Shirt",
  "itachi_naruto_embroidered_hoodie" => "Itachi-Inspired Embroidered Hoodie",
  "jjk_gojo_checkmark_embroidered_hoodie" => "Gojo-Inspired Embroidered Hoodie",
  "koi_fish_embroidered_hat" => "Koi Fish Embroidered Hat",
  "naruto_checkmark_embroidered_hoodie" => "Naruto-Inspired Checkmark Hoodie",
  "naruto_chest_embroidered_hoodie" => "Naruto-Inspired Chest Embroidered Hoodie",
  "naruto_embroidered_hoodie" => "Naruto-Inspired Embroidered Hoodie",
  "one_piece_luffy_gear_5_embroidered_hoodie" => "Gear 5-Inspired Embroidered Hoodie",
  "one_piece_luffy_printed_tshirt" => "Luffy-Inspired Printed T-Shirt",
  "punny_unproducktive_embroidered_hat_duck" => "Unproducktive Duck Embroidered Hat",
  "samurai_printed_tshirt" => "Samurai Printed T-Shirt",
  "save_the_sharks_printed_tshirt" => "Save the Sharks Printed T-Shirt",
  "waves_embroidered_creneck_hoodie" => "Ocean Waves Embroidered Crewneck",
  "palestine_print_wall_art" => "Palestine Printed Wall Art",
  "palestine_embroidery_wall_art" => "Palestine Embroidered Wall Art",
  "islamic_floral_surah_rahman_embroidery_and_print" => "Floral Surah Ar-Rahman Wall Art",
  "Allah_hanging_wall_art" => "Allah Hanging Wall Art",
  "Islamic_Wall_Art_Set_3_Bismillah_Alhamdulillah_Allah" => "Bismillah, Alhamdulillah & Allah Wall Art Set",
  "Islamic_Wall_Art_Print_Set_3_Subhanallah_Alhamdulillah_Allah" => "Subhanallah, Alhamdulillah & Allah Print Set",
  "Islamic_Wall_Art_Print_Set_3_Subhanallah_Alhamdulillah_Allah_canvas_gold_caligraphy" => "Gold Calligraphy Dhikr Canvas Set",
  "islamic_print_wall_art_remberance_of_allah_verse_quran" => "Remembrance of Allah Qur'an Verse Print",
  "Modern_Islamic_Calligraphy_Wall_Art_print_Set_3_Canvas_Framed" => "Modern Islamic Calligraphy Framed Set",
  "arabic_verse_embroidery_wall_art" => "Arabic Verse Embroidered Wall Art",
  "goku_printed_wall_art" => "Goku-Inspired Printed Wall Art",
  "two_swans_printed" => "Two Swans Art Print",
  "boathouse_framed_print_no_bg" => "Boathouse Framed Art Print",
}.freeze

WALL_ART_BASES = TITLE_OVERRIDES.keys.last(13).freeze
IGNORED_PRICED_BASES = ["Funny_Goose_Drink_More_Water_Shirt"].freeze
POST_V7_PRICED_BASES = [
  "Embroidered_Black_Cat_Broomstick",
  "always_cold_embroidered_hoodie",
  "autumn_cozy_season_embroidered_hoodie",
  "autumn_spooky_goose_crewneck",
  "autumn_spooky_goose_crewneck_type2",
  "in_my_cozy_era_sweatshirt_hoodie_crewneck",
  "winter_cardinal_snow_crewneck",
  "winter_hockey_goose_crewneck",
  "Personalized_Organic_Cotton_Knit_Baby_Blanket_Embroidered_Name_Keepsake",
  "little_goose_embroidery_baby_crewneck",
  "Auntie's_Favorite_Silly_Goose_Embroidered_Baby_Romper",
  "Personalized_Baby_Name_Embroidered_Romper_Organic_Cotton_Ribbed_Footie_Jumpsuit",
  "I_Go_Where_Mommy_Goes_Romper_Duck_Baby_Outfit_Embroidered_Baby_Bodysuit",
  "funny_Silly_Goose_on_the_loose_Baby_Romper",
  "hear_me_roar_Baby_Romper",
  "one_piece_fruit_of_the_devil_embroidered_hoodie",
  "luffy_wanted_poster_one_piece",
  "one_piece_zoro_embroidered_hoodie",
  "aot_eren_embroidered_hoodie",
  "demon_slayer_zenitsu_eyes_embroidered_hoodie",
  "hunter_x_hunter_kurapika_embroidered_hoodie",
  "vinland_saga_embroidered_hoodie",
  "one_piece_to_be_continued_embroidered_hoodie",
  "haikyuu_checkmark_embroidered_hoodie",
  "fullmetal_alchemist_edward_eyes_embroidered_hoodie",
  "Full_Metal_Alchemist_Transmutation_embroidered_crewneck",
  "fullmetal_alchemist_flamel_symbol_hat",
  "Fullmetal_alchemist_Flamel_Embroidered_Hoodie",
].freeze

def load_env(path)
  return {} unless File.exist?(path)

  File.readlines(path, chomp: true).each_with_object({}) do |line, values|
    next if line.strip.empty? || line.lstrip.start_with?("#") || !line.include?("=")

    key, value = line.split("=", 2)
    values[key.strip] = value.to_s.strip.gsub(/\A['"]|['"]\z/, "")
  end
end

def slugify(value)
  value.downcase
    .gsub("×", " x ")
    .gsub(/[^a-z0-9]+/, "-")
    .gsub(/\A-|\z-/, "")
end

def priced_groups
  groups = {}
  Dir.children(ASSET_DIR).sort.each do |filename|
    path = File.join(ASSET_DIR, filename)
    next unless File.file?(path)

    stem = File.basename(filename, File.extname(filename))
    price = nil
    part = 1
    base = nil
    if stem.match?(/_\d{2,3}_\d+\z/)
      match = stem.match(/_(\d{2,3})_(\d+)\z/)
      price = match[1].to_i
      part = match[2].to_i
      base = stem.sub(/_\d{2,3}_\d+\z/, "") if price >= 20
    elsif stem.match?(/_\d{2,3}\z/)
      match = stem.match(/_(\d{2,3})\z/)
      price = match[1].to_i
      base = stem.sub(/_\d{2,3}\z/, "") if price >= 20
    end
    next unless base
    # These assets are owned by later additive migrations and must not rewrite V7.
    next if IGNORED_PRICED_BASES.include?(base) || POST_V7_PRICED_BASES.include?(base)

    groups[base] ||= { price: price, files: [] }
    raise "Conflicting prices for #{base}" unless groups[base][:price] == price

    groups[base][:files] << [part, filename]
  end
  groups
end

def wall_art_groups
  WALL_ART_BASES.to_h do |base|
    files = Dir.children(ASSET_DIR).select do |filename|
      stem = File.basename(filename, File.extname(filename))
      stem == base || stem.match?(/\A#{Regexp.escape(base)}_\d+\z/)
    end
    ordered = files.sort_by do |filename|
      File.basename(filename, File.extname(filename))[/_(\d+)\z/, 1].to_i
    end
    [base, { price: nil, files: ordered.each_with_index.map { |filename, index| [index + 1, filename] } }]
  end
end

def kind_for(base)
  value = base.downcase
  return "wall art" if WALL_ART_BASES.include?(base)
  return "matching apparel set" if value.include?("matching") || value.include?("couples") || value.include?("wifey_hubby")
  return "embroidered hat" if value.include?("hat")
  return "quarter-zip sweatshirt" if value.include?("quarter_zip")
  return "crewneck sweatshirt" if value.include?("crewneck") || value.include?("creneck") || value.include?("sweatshirt")
  return "hoodie" if value.include?("hoodie")
  return "T-shirt" if value.include?("tshirt") || value.include?("t_shirt") || value.include?("shirt")

  "custom product"
end

def finish_for(base)
  value = base.downcase
  return "mixed-media" if value.include?("embroidery_and_print")
  return "embroidered" if value.include?("embroider")
  return "printed" if value.include?("print") || value.include?("tshirt") || value.include?("t_shirt") || value.include?("shirt")

  "decorated"
end

def customizable?(base)
  base.match?(/custom|personalized|anniversary|roman_numeral|yapper|wifey_hubby|kids_names|mama|papa|dad_and_grandpa/i)
end

def anime_inspired?(base)
  base.match?(/naruto|uchiha|akatsuki|itachi|pain_|sukuna|jjk|gojo|hunter_x_hunter|one_piece|luffy|attack_on_titan|levi|bleach|bankai|dragon_ball|dragonball|goku|fairy_tail|death_note/i)
end

def subject_for(title, kind)
  title.sub(/\s+(?:Printed|Embroidered)?\s*(?:T-Shirt|Hoodie|Crewneck|Sweatshirt|Quarter-Zip|Hat|Cap|Wall Art|Art Print|Print Set|Canvas Set|Framed Set|Matching Sweatshirt Set|Matching Hoodie Set|Couples Set)\z/i, "")
    .sub(/\s+-Inspired\z/i, "")
    .then { |subject| subject == title ? title.downcase : subject }
end

def descriptions_for(base, title)
  kind = kind_for(base)
  finish = finish_for(base)
  subject = subject_for(title, kind)
  if kind == "wall art"
    short = "A statement wall-art piece featuring #{subject}, selected to bring meaning and visual character to a room."
    long = "Bring a considered focal point to your home, office, or gifting moment with #{title}. The artwork is presented as a ready-to-order design and prepared with attention to colour, composition, and clean finishing. Final dimensions, framing, substrate, and hanging details should be confirmed before purchase so the piece fits the intended space."
  elsif customizable?(base)
    short = "A made-to-order #{finish} #{kind} personalized with names, dates, initials, or family details."
    long = "Create a meaningful, made-to-order piece with #{title}. Personal details are arranged for a balanced layout, then reviewed for legibility before decoration. Garment colour, sizing, placement, spelling, and the exact personalization will be confirmed before production. Because each piece is prepared individually, small layout adjustments may be made to suit the selected size."
  else
    article = finish.match?(/\A[aeiou]/i) ? "An" : "A"
    product_kind = kind == "embroidered hat" ? "hat" : kind
    finish_phrase = case finish
                    when "embroidered" then "using embroidery"
                    when "printed" then "using print"
                    else "using a #{finish} process"
                    end
    short = "#{article} #{finish} #{product_kind} featuring the #{subject} design with a clean, wearable finish."
    long = "#{title} pairs an expressive design with an easy-to-style #{product_kind}. The artwork is scaled and positioned to suit the product, then completed #{finish_phrase} for a clear presentation. Available colours and sizes may vary; review the final selection and care guidance before placing an order."
  end
  [short, long]
end

def tags_for(base)
  value = base.downcase
  tags = ["gallery", kind_for(base).downcase.gsub(/[^a-z0-9]+/, "-")]
  tags << "wall-art" if WALL_ART_BASES.include?(base)
  tags << "hoodies-sweatshirts" if value.match?(/hoodie|sweatshirt|crewneck|creneck|quarter_zip/)
  tags << "t-shirts" if value.match?(/tshirt|t_shirt|shirt/) && !value.match?(/sweatshirt/)
  tags << "hats" if value.include?("hat")
  tags << "personalized" if customizable?(base)
  tags << "anime-inspired" if anime_inspired?(base)
  tags << "family-gifts" if value.match?(/mama|dad|daddy|papa|grandma|grandpa|wifey|hubby|couple|anniversary/)
  tags << "funny" if value.match?(/funny|shenan|stability|unproducktive|problems|yapper/)
  tags << "islamic-art" if value.match?(/islamic|allah|quran|surah|arabic|palestine/)
  tags << finish_for(base)
  tags.uniq
end

def material_for(base)
  case kind_for(base)
  when "wall art" then "Art print, canvas, or textile artwork — specification varies"
  when "embroidered hat" then "Apparel cap with embroidery thread"
  when "matching apparel set" then "Apparel set with embroidery or print decoration"
  else "Apparel garment with #{finish_for(base)} decoration"
  end
end

def catalog
  groups = priced_groups.merge(wall_art_groups)
  unknown = groups.keys - TITLE_OVERRIDES.keys
  missing = TITLE_OVERRIDES.keys - groups.keys
  raise "Missing title metadata for: #{unknown.join(', ')}" unless unknown.empty?
  raise "Missing image groups for: #{missing.join(', ')}" unless missing.empty?

  TITLE_OVERRIDES.map do |base, title|
    group = groups.fetch(base)
    slug = slugify(title)
    short, long = descriptions_for(base, title)
    {
      base: base,
      slug: slug,
      name: title,
      description: short,
      long_description: long,
      price_cents: group[:price]&.*(100),
      images: group[:files].sort_by(&:first).map.with_index do |(_, filename), index|
        {
          filename: filename,
          public_id: "thread-and-butter/gallery/#{slug}/image-#{index + 1}",
        }
      end,
      material: material_for(base),
      customizable: customizable?(base),
      tags: tags_for(base),
    }
  end
end

def sql_string(value)
  "'#{value.to_s.gsub("'", "''")}'"
end

def sql_array(values)
  "ARRAY[#{values.map { |value| sql_string(value) }.join(', ')}]::text[]"
end

def write_migration(products)
  purchasable = products.select { |product| product[:price_cents] }
  rows = purchasable.map do |product|
    images = JSON.generate(product[:images].map { |image| image[:public_id] })
    [
      "uuid_generate_v5(uuid_ns_url(), #{sql_string("thread-and-butter/gallery/#{product[:slug]}")})",
      sql_string(product[:slug]),
      sql_string(product[:name]),
      sql_string(product[:description]),
      sql_string(product[:long_description]),
      sql_string("gallery"),
      product[:price_cents],
      sql_string("CAD"),
      sql_string(images),
      sql_string(product[:material]),
      "true",
      "false",
      product[:customizable] ? "true" : "false",
      sql_array(product[:tags]),
    ].then { |values| "(#{values.join(', ')})" }
  end

  sql = <<~SQL
    -- Generated by backend/scripts/sync_gallery_catalog.rb.
    -- Wall-art products without an approved filename price are intentionally excluded.
    INSERT INTO products (
      id, slug, name, description, long_description, category, price_cents, currency,
      images, material, is_active, is_featured, is_customizable, tags
    ) VALUES
    #{rows.join(",\n")}
    ON CONFLICT (slug) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      long_description = EXCLUDED.long_description,
      category = EXCLUDED.category,
      price_cents = EXCLUDED.price_cents,
      currency = EXCLUDED.currency,
      images = EXCLUDED.images,
      material = EXCLUDED.material,
      is_active = EXCLUDED.is_active,
      is_featured = EXCLUDED.is_featured,
      is_customizable = EXCLUDED.is_customizable,
      tags = EXCLUDED.tags,
      updated_at = now();
  SQL
  File.write(MIGRATION_PATH, sql)
  puts "Wrote #{purchasable.length} products to #{MIGRATION_PATH}"
end

def upload_images(products, env)
  cloud_name = env.fetch("CLOUDINARY_CLOUD_NAME")
  api_key = env.fetch("CLOUDINARY_API_KEY")
  api_secret = env.fetch("CLOUDINARY_API_SECRET")
  endpoint = "https://api.cloudinary.com/v1_1/#{cloud_name}/image/upload"
  images = products.flat_map { |product| product[:images] }

  images.each_with_index do |image, index|
    timestamp = Time.now.to_i
    public_id = image[:public_id]
    signature_source = "overwrite=true&public_id=#{public_id}&timestamp=#{timestamp}#{api_secret}"
    signature = Digest::SHA1.hexdigest(signature_source)
    path = File.join(ASSET_DIR, image[:filename])
    command = [
      "curl", "--silent", "--show-error", "--fail-with-body", "-X", "POST", endpoint,
      # curl treats commas and semicolons in an unquoted form-file path as separators.
      "-F", "file=@\"#{path}\"",
      "-F", "api_key=#{api_key}",
      "-F", "timestamp=#{timestamp}",
      "-F", "overwrite=true",
      "-F", "public_id=#{public_id}",
      "-F", "signature=#{signature}",
    ]
    stdout, stderr, status = Open3.capture3(*command)
    unless status.success?
      raise "Cloudinary upload failed for #{image[:filename]}: #{stderr} #{stdout}"
    end
    response = JSON.parse(stdout)
    raise "Unexpected Cloudinary public ID for #{image[:filename]}" unless response["public_id"] == public_id

    puts format("[%3d/%3d] %s", index + 1, images.length, public_id)
  end
end

options = { upload: false, write_sql: false }
OptionParser.new do |parser|
  parser.on("--upload", "Upload all catalog images to Cloudinary") { options[:upload] = true }
  parser.on("--write-sql", "Generate the Gallery Flyway migration") { options[:write_sql] = true }
end.parse!

products = catalog
puts "Catalog: #{products.length} products, #{products.sum { |product| product[:images].length }} images"
puts "Publishable now: #{products.count { |product| product[:price_cents] }} products"
puts "Waiting for prices: #{products.count { |product| !product[:price_cents] }} wall-art products"

write_migration(products) if options[:write_sql]
upload_images(products, load_env(File.join(ROOT, "backend", ".env"))) if options[:upload]
