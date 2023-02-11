import React from 'react';


const Table = ({rowData,headers}) => {
    return (
        <>
            <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                <thead
                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    {headers && headers?.map((ele,index)=>(
                        <th scope="col" className="py-3 px-6" key={index}>{ele.toUpperCase()}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {rowData && rowData?.length && rowData.map((ele, index) => (
                    <tr className='bg-white border-b dark:bg-gray-800 dark:border-gray-700' key={index}>
                        {headers && headers?.map((item,id)=>(
                            <td className="py-4 px-6" key={id}>{ele[item]}</td>
                        ))}
                    </tr>
                ))}

                </tbody>
            </table>
        </>
    )
};

export default Table;