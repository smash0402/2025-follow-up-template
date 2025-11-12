-- サンプルテーブル
CREATE TABLE todo (
  no INT AUTO_INCREMENT PRIMARY KEY,         -- 番号
  title VARCHAR(100) NOT NULL,               -- タイトル
  content VARCHAR(500) NOT NULL,             -- 内容
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,          -- 作成日
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- 更新日
);