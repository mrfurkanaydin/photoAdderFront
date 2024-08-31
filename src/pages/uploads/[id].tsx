import { useRouter } from 'next/router';
import React from 'react'

function uploads() {
    const router = useRouter();
    const { id } = router.query;
    return (
        <div>{id} Yükleme Sayfası</div>
    )
}

export default uploads