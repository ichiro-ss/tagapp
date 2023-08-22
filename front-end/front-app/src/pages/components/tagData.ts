export type TagData = {
    id : number;
    userName : string
    tagName : string
    memoNum : number
}

const convertTagJsonToTagData = ( data : any ) :TagData => {
    const id = parseInt(data.id)
    const userName = data.UserId
    const tagName = data.name
    const memoNum = data.memoNum

    const tagData : TagData = {
        id : id,
        userName: userName,
        tagName: tagName,
        memoNum: memoNum,
    }

    return tagData
}

export const convertTagJsonArrayToTagDataArray= ( dataArray : any ) : TagData[] => {
    const tagDataArray : TagData[] = []

    if ( dataArray == null ) {
        return tagDataArray;
    }
    
    for ( const data of dataArray ) {
        tagDataArray.push(convertTagJsonToTagData(data))
    }

    return tagDataArray;
}
