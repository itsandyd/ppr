import Image from "next/image"

interface EmptyProps {
    label: string;
}

const AiEmpty = ({
    label
}: EmptyProps) => {
  return (
    <div className="h-full p-20 flex flex-col items-center justify-center">
        {/* <div className="relative h-72 w-72"> */}
            {/* <Image 
                fill
                alt="Empty"
                src="/ppr.svg"
            /> */}
        {/* </div> */}
        <div className="text-muted-foreground text-sm text-center">
            {label}
        </div>
    </div>
  )
}

export default AiEmpty;