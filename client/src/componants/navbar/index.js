import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <div>
        <nav className="flex p-7 shadow-lg justify-center bg-blue-900 rounded-lg w-screen">
            <div className='w-[70%]'>
            <ul className="flex w-auto flex-1 justify-center space-x-10 flex-wrap text-gray-200 font-semibold">
                <li>
                    <Link to="/dashboard" className="hover:text-gray-300">Home</Link>
                </li>
                <li>
                    <Link to="/todolist" className="hover:text-gray-300">Todolist</Link>
                </li>
                <li>
                    <Link to="/realchat" className=" hover:text-gray-300">Real chat</Link>
                </li>
                <li>
                    <Link to="/authentication" className="hover:text-gray-300">Authentication</Link>
                </li>
            </ul>
            </div>
        </nav>
        </div>
    );
}
