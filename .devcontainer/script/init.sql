-- ログイン認証用データテーブル
CREATE TABLE userInfos(
  userid VARCHAR(100)  COLLATE utf8mb4_bin NOT NULL PRIMARY KEY ,    -- ユーザーid
  password VARCHAR(100) NOT NULL,              -- パスワード
  name VARCHAR(500) NOT NULL                   -- 名前
);

-- Todoリスト用テーブル
CREATE TABLE todos (
  id INT AUTO_INCREMENT PRIMARY KEY,         -- 番号
  title VARCHAR(100) NOT NULL,               -- タイトル
  content VARCHAR(500) NOT NULL,             -- 内容
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,          -- 作成日
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  -- 更新日
  priority VARCHAR(10) NOT NULL,             -- 優先度
  public_private VARCHAR(10) NOT NULL,       -- 公開/非公開
  userid VARCHAR(100)  COLLATE utf8mb4_bin NOT NULL,              -- ユーザーid
  todoState VARCHAR(10) NOT NULL,         -- タスク完了or未完了
  deadline DATE,
  FOREIGN KEY  (userid) REFERENCES userInfos(userid)
);
