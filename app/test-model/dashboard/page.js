import Link from "next/link";

const DashboardPage = () => {
    return (
        <>
            <div className="container mx-auto p-5">
                <div>
                    <Link href="/test-model/dashboard/create" className="bg-blue-500 text-white py-2 px-7 rounded">
                        Create New Test
                    </Link>
                </div>
            </div>
        </>
    )
}

export default DashboardPage;