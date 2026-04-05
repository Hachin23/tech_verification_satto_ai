class PhotosController < ApplicationController
  # 開発・検証用：VueからのPOST時にCSRFトークンチェックをスキップ
  skip_before_action :verify_authenticity_token

  def create
    image_data = params[:image]

    if image_data.present?
      # 1. Base64デコード（バイナリ化）
      content_type = image_data[%r{(image/[a-z]{3,4})}]
      body = image_data.sub(%r{data:image/[a-z]{3,4};base64,}, '')
      decoded_data = Base64.decode64(body)

      # 2. メモリ上に仮想ファイルを作成
      file = StringIO.new(decoded_data)
      filename = "photo_#{Time.current.to_i}.jpg"

      # 3. Photoレコード作成と画像アタッチ
      @photo = Photo.new
      @photo.image.attach(io: file, filename: filename, content_type: content_type)

      if @photo.save
        # 成功：保存した画像のURLを返却
        render json: { 
          status: 'success', 
          id: @photo.id,
          url: Rails.application.routes.url_helpers.url_for(@photo.image) 
        }, status: :created
      else
        render json: { status: 'error', message: @photo.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render json: { status: 'error', message: 'No image data' }, status: :bad_request
    end
  end
end