import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import path from '../../ultils/path';
import Swal from 'sweetalert2';

const FinalRegister = () => {
    const { status } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const showAlert = async () => {
            if (status === 'failed') {
                await Swal.fire('Opp!', 'Đăng ký không thành công', 'error');
            } else if (status === 'success') {
                await Swal.fire('Congratulations', 'Đăng ký thành công. Hãy đăng nhập', 'success');
            }
            navigate(`${path.LOGIN}`);
        };

        showAlert();
    }, [status, navigate]);

    return (
        <div className='h-screen w-screen bg-pink-100'></div>
    );
};

export default FinalRegister;
