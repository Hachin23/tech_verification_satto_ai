/**
 * 画像Blobをリサイズしてサムネイル(Blob)を作成する
 * @param file オリジナルのBlob
 * @param maxWidth 最大幅 (px)
 * @returns リサイズされたBlob
 */
export const createThumbnail = async (file: Blob, maxWidth: number = 300): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      // アスペクト比を維持してサイズ計算
      const scale = maxWidth / image.width;
      const width = maxWidth;
      const height = image.height * scale;

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // canvasに描画（リサイズ実行）
      ctx.drawImage(image, 0, 0, width, height);

      // canvasからBlobに変換
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url); // メモリ解放
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas to Blob conversion failed'));
        }
      }, 'image/jpeg', 0.7); // 画質は70%程度で十分軽量
    };

    image.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };

    image.src = url;
  });
};