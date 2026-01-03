# ame:ato

## プロジェクト構造 (Project Structure)

このプロジェクトは、フロントエンドとバックエンドのモノレポ構成になっています。

- `.`: フロントエンド (Next.js)
- `./backend`: バックエンド (Go)

## フロントエンド (Frontend)

Next.js (App Router) を使用しています。

### 特徴的な実装 (Key Features)

#### Optimistic UI & Polling

通信量を最小限に抑え、ユーザーの体感速度を向上させるため、以下の「Optimistic UI (楽観的 UI)」方式を採用しています。

1.  **即時反映**: メッセージ送信時 (`POST`)、サーバーからのレスポンスを待たずに、ローカルの State を即座に更新して画面にメッセージを表示します。これにより、ユーザーは待ち時間なく操作を継続できます。
2.  **バックグラウンド同期**: 送信処理はバックグラウンドで行われます。成功すればそのまま、失敗した場合（オフラインなど）は再送キュー (`unSyncedMessages`) に保存され、オンライン復帰時に自動的に再送されます。
3.  **ポーリング**: 他のユーザーが投稿したメッセージの取得は、定期的なポーリング (`useMessages` hook) によって行われます。送信直後に `GET` リクエストを行わないことで、不要な通信を削減しています。

#### Offline Support

オフライン時でもメッセージの送信が可能です。送信したメッセージはローカルに保存され、オンライン復帰時に自動的にサーバーへ送信されます。
自動送信時にも Optimistic UI が適用されます。

#### Hooks

ロジックは Hooks に切り出されています。

- **`useCreateMessage`**: メッセージの送信ロジックを担当します。
- **`useMessages`**: メッセージの取得（ポーリング）ロジックを担当します。
- **`useKeyShortcuts`**: キーボードショートカットのイベントハンドリングを管理します。
- **`useAutoClose`**: ダイアログなどの自動クローズタイマーを管理します。

## バックエンド (Backend)

Go 言語で実装されており、Clean Architecture を意識したレイヤー構造になっています。
DI (Dependency Injection) には `google/wire` を使用しています。

### アーキテクチャ (Architecture)

リクエストは以下の順に処理されます。

**Flow:**
`Router` -> `Handler` -> `Controller` -> `Repository` -> `DB`

### 各層の役割 (Layers)

- **Router (`router`)**:

  - ルーティング定義 (`gin`) を行います。
  - HTTP リクエストを受け取り、適切な Handler に振り分けます。
  - Middleware の設定もここで行います。

- **Handler (`handler`)**:

  - HTTP リクエストのハンドリングを行います。
  - リクエストパラメータのバインドやバリデーション、レスポンスの生成（JSON 化など）を担当します。
  - ビジネスロジックを実行するために `Controller` を呼び出します。

- **Controller (`controller`)**:

  - アプリケーション固有のビジネスロジックを実装します。
  - データの加工や判定などを行い、データアクセスのために `Repository` を呼び出します。

- **Repository (`repository`)**:
  - データベース (`DB`) へのアクセスを担当します。
  - 具体的な SQL の実行やデータの取得・保存を行います。

### API Interfaces

#### `/messages`

- **GET**: メッセージ一覧を取得します。
  - Out: `message[]` (200)

#### `/messages` (POST)

- **POST**: 新しいメッセージを作成します。
  - In: `message`
  - Out: `nil` (201 Created)

### Swagger

API ドキュメントは Swagger で自動生成されています。
`backend/docs/swagger.yaml` を参照してください。

また、Swagger は swaggo を用いて自動生成されており、フロントエンドの型定義ファイル`.d.ts`も自動生成されています。

## 環境変数 (Environment Variables)

バックエンドの環境変数は `backend/.env.example`（バックエンド用）, `./.env.example`（フロントエンド用）を参考に設定してください。

## 開発環境のセットアップ (Setup Development Environment)

1. リポジトリをクローンします。
   ```bash
   git clone https://github.com/KanadeSisido/ame-ato.git
   ```
1. 依存関係をインストールします。
   ```bash
   pnpm install
   ```
1. バックエンドの環境変数を設定します。
   ```bash
   cp backend/.env.example backend/.env
   cp ./.env.example ./.env
   ```
   必ず、`backend/.env` と `./.env` の内容を適切に変更してください。
1. 開発用データベースを起動します（Docker 推奨）。
   ```bash
   cd backend
   docker compose up -d
   ```
1. フロントエンドとバックエンドの開発サーバーを起動します。
   ```bash
   cd ../
   pnpm dev
   ```
1. ブラウザで `http://localhost:3000` にアクセスします。

## テストの実行 (Running Tests)

バックエンドのテストは以下のコマンドで実行できます。

```bash
cd backend
go test ./...
```

# License

This project is licensed under the MIT License.
MIT License
Copyright (c) 2024 Kanade Sisido
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

# 免責事項 (Disclaimer)

このソフトウェアは現状のままで提供されており、明示または黙示を問わず、いかなる保証もありません。著作権者または権利者は、本ソフトウェアの使用またはその他の取引に起因または関連して生じたいかなる請求、損害またはその他の責任についても、一切責任を負いません。
