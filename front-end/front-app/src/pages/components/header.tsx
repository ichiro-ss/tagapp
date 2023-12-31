import Head from "next/head";
import styles from '../../styles/index.module.css';

interface HeaderProps {
    title : string;
    className?: string; // className プロパティを追加
};

const Header: React.FC<HeaderProps> = (props) => {

    return(
        <div>
            <Head >
                <meta name="viewport" content="width=device-width, inictial-scale=1, charset=utf-8" />
                <title>{props.title}</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous"></link>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossOrigin="anonymous"></script>
            </Head>
            <header className={`${styles["header"]} ${props.className || ''} `}>
                <h2 className={styles["title"]}>{props.title}</h2>
            </header>
        </div>
    )
};

export default Header;
