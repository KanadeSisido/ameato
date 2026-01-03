import React from "react";
import { MPLUSRounded1c } from "../fonts/font";
import Link from "next/link";

const page = () => {
	return (
		<div
			className={
				"flex flex-col gap-8 items-start w-full bg-gray-600 px-3 py-6 " +
				MPLUSRounded1c.className
			}
		>
			<Link href='/'>
				<p className='text-white underline mb-4 cursor-pointer'>
					← Back to Home
				</p>
			</Link>
			<h1 className='text-4xl font-bold text-white'>About ame:ato</h1>
			<div className='mt-4 max-w-2xl text-white px-4'>
				<p className='mb-2'>
					ame:atoは、雨の日の窓みたいなSNSアプリケーションです。
					曇った窓を指でなぞったように、短いメッセージを描くことができます。
				</p>
				<p className='mb-2'>
					画面のどこかをタップしてメッセージを描き、送信ボタンを押すと、そのメッセージが他のユーザーにも表示されます。
					メッセージは一定時間が経過すると徐々に薄くなり、やがて消えていきます。
				</p>
				<p className='mb-2'>
					ame:ato is a social networking application that resembles a rainy
					window. You can draw short messages as if you were tracing a foggy
					window with your finger.
				</p>
				<p>
					Tap anywhere on the screen to draw your message, and press the send
					button to share it with other users. Messages will gradually fade away
					and eventually disappear after a certain period of time.
				</p>
			</div>

			<h1 className='text-4xl font-bold text-white'>Terms of Service</h1>
			<div className='mt-4 max-w-2xl text-white px-4'>
				<div className='prose prose-invert max-w-none'>
					<p>
						本利用規約（以下「本規約」といいます。）は、Kanade
						Sisido（以下「制作者」といいます。）が提供するサービス「ame:ato」（以下「本サービス」といいます。）の利用条件を定めるものです。利用者は、本サービスを利用することにより、本規約に同意したものとみなされます。
					</p>
					<h2 id='-1-'>第1条（サービス概要）</h2>
					<p>
						本サービスは、雨の日の窓のように曇った画面上を指やマウスでなぞることで文字を描き、匿名で投稿できる掲示板サービスです。投稿された文字は時間の経過とともに薄くなり、投稿から約4時間後に画面上から非表示になります。
					</p>
					<h2 id='-2-'>第2条（利用条件）</h2>
					<ol>
						<li>
							本サービスは匿名で利用することができ、利用者登録は不要です。
						</li>
						<li>本サービスでは、Cookieその他の追跡技術を使用しません。</li>
						<li>
							利用者は、日本国の法令および公序良俗を遵守して本サービスを利用するものとします。
						</li>
					</ol>
					<h2 id='-3-'>第3条（禁止事項）</h2>
					<p>利用者は、以下の行為を行ってはなりません。</p>
					<ol>
						<li>法令または公序良俗に違反する行為</li>
						<li>他者を誹謗中傷し、または権利・利益を侵害する行為</li>
						<li>本サービスの運営を妨害する行為</li>
						<li>不正アクセス、またはこれを試みる行為</li>
						<li>その他、制作者が不適切と判断する行為</li>
					</ol>
					<h2 id='-4-'>第4条（投稿内容の取り扱い）</h2>
					<ol>
						<li>
							利用者が投稿した文字データ（以下「投稿データ」といいます。）は、投稿後4時間を目安に画面上から非表示となります。
						</li>
						<li>
							投稿データは、サービス運営および不正防止等の目的のため、データベース上に保存されます。
						</li>
						<li>
							投稿データの削除を希望する場合は、第8条に定める連絡先までお問い合わせください。
						</li>
					</ol>
					<h2 id='-5-'>第5条（知的財産権）</h2>
					<p>
						本サービスおよび本サービスに関連するプログラム、デザイン、表現に関する知的財産権は、制作者または正当な権利者に帰属します。
					</p>
					<h2 id='-6-'>第6条（免責事項）</h2>
					<ol>
						<li>
							制作者は、本サービスの内容の正確性、完全性、有用性について保証しません。
						</li>
						<li>
							本サービスの利用により利用者に生じた損害について、制作者は一切の責任を負いません。ただし、制作者の故意または重過失による場合を除きます。
						</li>
						<li>
							本サービスは、予告なく内容の変更、中断または終了することがあります。
						</li>
					</ol>
					<h2 id='-7-'>第7条（規約の変更）</h2>
					<p>
						制作者は、必要と判断した場合には、本規約を変更することができます。変更後の規約は、本サービス上に掲載された時点で効力を生じます。
					</p>
					<h2 id='-8-'>第8条（連絡先）</h2>
					<p>
						本サービスに関するお問い合わせ、投稿データの削除依頼は、以下の連絡先までご連絡ください。
					</p>
					<p>
						メールアドレス：
						<a href='mailto:kanade@sisido.dev'>kanade@sisido.dev</a>
					</p>
					<hr />
					<h1 id='-privacy-policy-'>プライバシーポリシー（Privacy Policy）</h1>
					<p>
						制作者は、本サービスにおける利用者の情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。
					</p>
					<h2 id='-1-'>第1条（取得する情報）</h2>
					<p>本サービスでは、以下の情報を取得します。</p>
					<ol>
						<li>投稿されたテキストデータ</li>
						<li>投稿時の画面上の位置情報（座標情報）</li>
						<li>投稿日時</li>
					</ol>
					<p>
						※本サービスは匿名で利用でき、氏名、メールアドレス等の個人情報は取得しません。また、Cookieは使用しません。
					</p>
					<h2 id='-2-'>第2条（利用目的）</h2>
					<p>取得した情報は、以下の目的で利用します。</p>
					<ol>
						<li>本サービスの提供・運営のため</li>
						<li>不正行為の防止および対応のため</li>
						<li>サービス品質の改善のため</li>
					</ol>
					<h2 id='-3-'>第3条（情報の保存と削除）</h2>
					<ol>
						<li>
							投稿データは、画面上では投稿から約4時間後に非表示となります。
						</li>
						<li>データベース上には投稿データが保存されます。</li>
						<li>
							利用者から削除の要請があった場合、合理的な期間内に対応します。
						</li>
					</ol>
					<h2 id='-4-'>第4条（第三者提供）</h2>
					<p>
						制作者は、法令に基づく場合を除き、取得した情報を第三者に提供しません。
					</p>
					<h2 id='-5-'>第5条（セキュリティ対策）</h2>
					<p>
						制作者は、取得した情報を適切に管理するため、以下のセキュリティ対策を講じています。
					</p>
					<ol>
						<li>通信のHTTPS化</li>
						<li>データベースへのパスワード設定によるアクセス制御</li>
					</ol>
					<h2 id='-6-'>第6条（ポリシーの変更）</h2>
					<p>
						本プライバシーポリシーは、必要に応じて変更されることがあります。変更後の内容は、本サービス上に掲載された時点で効力を生じます。
					</p>
					<h2 id='-7-'>第7条（お問い合わせ窓口）</h2>
					<p>本ポリシーに関するお問い合わせは、以下までご連絡ください。</p>
					<p>
						メールアドレス：
						<a href='mailto:kanade@sisido.dev'>kanade@sisido.dev</a>
					</p>
					<hr />
					<p>制定：2026年1月</p>
				</div>
			</div>

			<h1 className='text-4xl font-bold text-white'>Open Font License</h1>
			<div className='mt-4 max-w-2xl text-white px-4'>
				<p className='mb-2'>
					The fonts used in ame:ato, including Josefin Sans and M PLUS Rounded
					1c, are licensed under the SIL Open Font License (OFL). This license
					allows you to use, modify, and distribute the fonts freely, provided
					that you adhere to the terms of the OFL.
				</p>
				<p className='mb-2'>
					You can find more information about the SIL Open Font License and the
					specific terms governing the use of these fonts at{" "}
					<a
						href='https://openfontlicense.org/open-font-license-official-text/'
						className='underline'
					>
						https://openfontlicense.org/open-font-license-official-text/
					</a>
					.
				</p>
			</div>
		</div>
	);
};

export default page;
