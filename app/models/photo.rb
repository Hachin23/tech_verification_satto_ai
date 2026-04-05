class Photo < ApplicationRecord
  # Active Storageとの紐付け
  has_one_attached :image
end
