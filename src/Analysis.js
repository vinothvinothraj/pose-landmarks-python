import UserListComponent from './UserListComponent';
import FormComponent from "./FormComponent";
const Analysis = () => {
    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl text-gray-800 font-bold mb-6 text-center">Analysis Page</h2>
            <FormComponent />
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">User List</h2>
                <UserListComponent />
            </div>
        </div>
    );
};

export default Analysis;
