import Header from "../components/header"

export default function Home() {
    const title = "Test Page"

    
    return (
        <div>
            <Header title={title}/>
            <h1 className="bg-primar">Test Page</h1>
        </div>
    )
}