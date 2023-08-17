export type MemoData = {
    tag: string[];
    date: number; // 例: 20230816103045
    title: string;
    comment: string;
    files: File[];
};
  
export const memos: MemoData[] = [
{
    tag: ["タグ1", "タグ2", "タグ3"],
    date: 20230816103045,
    title: "タイトル",
    comment: "ここにコメントを記述",
    files: [], // デフォルトでは空の配列
},
{
    tag: ["映画", "インド"],
    date: 20230816111520,
    title: "RRR",
    comment: "面白すぎる，，，インド映画にはまったきっかけ",
    files: [],
},
{
    tag: ["ゲーム", "スマホ", "ポケモン"],
    date: 20230816111700,
    title: "ポケモンスリープ",
    comment: "イーブイかわいい",
    files: [],
},
{
    tag: ["映画", "本", "ジブリ"],
    date: 20230817111700,
    title: "君たちはどう生きるか",
    comment: "本は良かった．なお映画",
    files: [],
},
{
    tag: ["映画", "ポケモン"],
    date: 20230814111700,
    title: "ミュウと波動の勇者ルカリオ",
    comment: "かっこいー",
    files: [],
},
{
    tag: ["ゲーム", "ポケモン"],
    date: 20230814111700,
    title: "ポケモンダイアモンド・パール",
    comment: "めっちゃ楽しい！映画化したけど見に行こうかな",
    files: [],
},
{
    tag: ["ごはん", "パスタ"],
    date: 20230817111700,
    title: "",
    comment: "久しぶりに家でパスタたべた！",
    files: [],
},
{
    tag: ["ごはん", "パスタ"],
    date: 20230602111700,
    title: "",
    comment: "粉チーズとハバネロ入れるとやっぱそれっぽくなるよね",
    files: [],
},



];
