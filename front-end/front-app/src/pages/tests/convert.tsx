import { MemoData } from "../components/memoData";

const convertJsonToMemoData = (data : any) => {

    const memo = data.Memo
    const title = memo.Title
    const date = new Date(memo.CreatedAt)
    const dateStr = date.toLocaleString()
    const id = parseInt(memo.id)
    let picpath =  ""

    if ( memo.PicPath === "undefined" ) {
        picpath = ""
    } else {
        picpath = memo.PicPath.substring(1)
    }
    const comment = memo.Content
    const userid = memo.UserId

    const tags = data.Tags

    const memodata : MemoData = {
        title : title,
        userid : userid,
        comment : comment,
        filepath : picpath,
        id : id,
        date : dateStr,
        tag : tags,
    }

    return memodata
}
