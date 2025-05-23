function CardExperience({ data, isLast = false, isFirst = false }) {
    const classFirst = isFirst ? ' bg-gray-300 ' : 'bg-gray-100';
    return (
        <>
            <div className="flex w-full ">
                <div className="mr-4 flex  flex-col items-center">
                    <div>
                        <div className={'flex h-28 w-28 items-center justify-center rounded-full  p-2 ' + classFirst}>
                            <img src={data.logoCompanySource} alt="logo" className="h-20 w-20 object-contain " />
                        </div>
                    </div>
                    {!isLast && <div className="h-20 w-[1px] bg-gray-300 dark:bg-slate-50 " />}
                </div>
                <div className="pt-1  h-20 flex flex-col justify-center w-full">
                    <div className=" flex justify-between w-full items-center mb-2 text-xl font-bold  dark:text-slate-300 text-tp-orange">
                        {data.companyName}
                        <span className="text-gray-700 text-sm">{data.workTime}</span>
                    </div>
                    <p className="text-gray-600 dark:text-slate-400">{data.position}</p>
                </div>
            </div>
        </>
    );
}

export default CardExperience;
