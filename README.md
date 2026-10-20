# hello-appset-2

Namespace `hello-appset-2` の DEMO アプリです。S3 バケット `hello-appset-2-202610` の `message.txt` を読み、画面に出します。オブジェクトが無い、または S3 に届かないときは `Hello World` を出します。

AWS の読み取り権限は Pod の IRSA です。Deployment にはアクセスキーを置きません。
