import { Suspense } from 'react';
import RegisterClient from './RegisterClient';

export default function Page() {
return (
<Suspense fallback={<div className="p-10 text-center">Loading...</div>}> <RegisterClient /> </Suspense>
);
}
