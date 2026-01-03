# ame:ato

## プロジェクト構造 (Project Structure)
このプロジェクトは、フロントエンドとバックエンドのモノレポ構成になっています。

- `ameato/ameato`: フロントエンド (Next.js)
- `ameato/ameato/backend`: バックエンド (Go)

## フロントエンド (Frontend)
Next.js (App Router) を使用しています。

### 特徴的な実装 (Key Features)

#### Optimistic UI & Polling
通信量を最小限に抑え、ユーザーの体感速度を向上させるため、以下の「Optimistic UI (楽観的UI)」方式を採用しています。

1.  **即時反映**: メッセージ送信時 (`POST`)、サーバーからのレスポンスを待たずに、ローカルのStateを即座に更新して画面にメッセージを表示します。これにより、ユーザーは待ち時間なく操作を継続できます。
2.  **バックグラウンド同期**: 送信処理はバックグラウンドで行われます。成功すればそのまま、失敗した場合（オフラインなど）は再送キュー (`unSyncedMessages`) に保存され、オンライン復帰時に自動的に再送されます。
3.  **ポーリング**: 他のユーザーが投稿したメッセージの取得は、定期的なポーリング (`useMessages` hook) によって行われます。送信直後に `GET` リクエストを行わないことで、不要な通信を削減しています。

#### Hooks
ロジックは再利用可能なHooksに切り出されています。

- **`useCreateMessage`**: メッセージの送信ロジックを担当します。
- **`useMessages`**: メッセージの取得（ポーリング）ロジックを担当します。
- **`useKeyShortcuts`**: キーボードショートカットのイベントハンドリングを管理します。
- **`useAutoClose`**: ダイアログなどの自動クローズタイマーを管理します。

## バックエンド (Backend)
Go言語で実装されており、Clean Architectureを意識したレイヤー構造になっています。
DI (Dependency Injection) には `google/wire` を使用しています。

### アーキテクチャ (Architecture)
リクエストは以下の順に処理されます。

**Flow:**
`Router` -> `Handler` -> `Controller` -> `Repository` -> `DB`

### 各層の役割 (Layers)

- **Router (`router`)**: 
  - ルーティング定義 (`gin`) を行います。
  - HTTPリクエストを受け取り、適切なHandlerに振り分けます。
  - Middlewareの設定もここで行います。

- **Handler (`handler`)**: 
  - HTTPリクエストのハンドリングを行います。
  - リクエストパラメータのバインドやバリデーション、レスポンスの生成（JSON化など）を担当します。
  - ビジネスロジックを実行するために `Controller` を呼び出します。

- **Controller (`controller`)**: 
  - アプリケーション固有のビジネスロジックを実装します。
  - データの加工や判定などを行い、データアクセスのために `Repository` を呼び出します。

- **Repository (`repository`)**: 
  - データベース (`DB`) へのアクセスを担当します。
  - 具体的なSQLの実行やデータの取得・保存を行います。

### API Interfaces

#### `/messages`
- **GET**: メッセージ一覧を取得します。
  - Out: `message[]` (200)

#### `/messages` (POST)
- **POST**: 新しいメッセージを作成します。
  - In: `message`
  - Out: `nil` (201 Created)
