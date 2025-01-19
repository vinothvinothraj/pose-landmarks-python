import UserListComponent from './UserListComponent';
import FormComponent from "./FormComponent";

const Analysis = () => {
    return (
        <div className="container mx-auto p-6 bg-gray-100 rounded-md shadow-md">
            <h2 className="text-2xl text-gray-200 font-bold mb-6 text-center bg-zinc-800 p-4 rounded-md">Analysis Page</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-md shadow-sm">
                    <FormComponent />
                </div>
          
                <div className="bg-white p-6 rounded-md shadow-sm">
                    <UserListComponent />
                </div>
            </div>
        </div>
    );
};

export default Analysis;
