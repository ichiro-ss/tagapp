export type MemoData = {
    title: string;
    userid ?:string,
    comment: string;
    filepath ?:string,
    id ?:number,
    date: string; // 例: 20230816103045
    tag: string[];
};
  
const convertMemoJsonToMemoData  = ( data: any ) : MemoData => {
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

export const convertMemoJsonArrayToMemoDataArray = ( dataArray : any ) : MemoData[] => {
    const memoDataArray : MemoData[] = []

    if ( dataArray == null ) {
        return memoDataArray;
    }
    
    for ( const data of dataArray ) {
        memoDataArray.push(convertMemoJsonToMemoData(data))
    }

    return memoDataArray;
}