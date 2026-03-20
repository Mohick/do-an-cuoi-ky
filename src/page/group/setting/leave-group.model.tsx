



import { AlertTriangle } from "lucide-react";
import { Link, useNavigate,  useParams } from "react-router-dom";
import { patchLeaveGroupAPI } from "../../../api/group";



const ModelLeaveGroup = () => {
    const { id_group } = useParams()
    const navgagte = useNavigate()

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full mx-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-xl font-bold text-gray-800">Rời nhóm</h2>
                </div>

                {/* Content */}
                <p className="text-gray-600 mb-6">
                    Bạn có chắc chắn muốn rời khỏi nhóm này? Hành động này không thể hoàn tác.
                </p>

                {/* Buttons */}
                <div className="flex gap-3 justify-end">
                    <Link to={`/group/${id_group}/setting`} >
                        <button

                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy
                        </button>
                    </Link>
                    <button
                        onClick={async () => {
                            try {
                                await patchLeaveGroupAPI({id_group: id_group as string  });
                                navgagte('/dashboard')
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                        className="px-4 py-2 cursor-pointer rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Rời nhóm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModelLeaveGroup;