  import Dexie, { type Table } from 'dexie';

  //　写真の情報及び診断情報を保持するテーブル
  export interface PhotoRecord {
    id?: number;
    // 前回撮影した写真
    beforeImage: Blob;
    // 取り直した最新の写真
    afterImage: Blob | null;
    // 一覧画面のサムネイル
    thumbnailImage: Blob | null;

    // AIからの助言
    advice?: string | null;
    // 助言の理由
    tips?: string | null;

    // 改善ポイント（明るさ・コントラスト・色の鮮やかさ）の値を格納
    scores: {
      brightness: number;
      contrast: number;
      vibrance: number;
    } | null;

    // 合格判定ランク
    resultRank: 'S' | 'A' | 'B' | 'C' | null;
    // お気に入り
    isFavorite: boolean;

    // サーバー側のphoto_recordsの主キー（同期後に設定する）
    serverId?: number | null;
    // 同期ステータス（0: 未同期, 1: 同期中, 2: 同期済み）
    syncStatus: number;

    // 撮影日時
    createdAt: number;
    updatedAt: number;
  }

  //　設定を保持するテーブル
  export interface Setting {
    key: string;
    value: any;
  }

  // 2. データベースクラスの定義
  export class SattoPhotoDatabase extends Dexie {
    photos!: Table<PhotoRecord>;
    settings!: Table<Setting>;

    constructor() {
      super('SattoPhotoAI_DB');
      
      // スキーマ定義
      this.version(1).stores({
        // '++id' は自動インクリメント、'createdAt' は検索用インデックス
        photos: '++id, createdAt, isFavorite',
        // keyを主キー
        settings: 'key'
      });
    }
  }

  // 3. インスタンスをエクスポート
  export const db = new SattoPhotoDatabase();