
import NewSPublish from "./NewSPublish";
import usePublish from "./usePublish";
import {Button} from "antd";

export default function Sunset() {
    const {publishList, categories,handleDelete} = usePublish(3)

    return (
        <div>
            <NewSPublish publishList={publishList} categories={categories} button={(id)=><Button danger onClick={()=>handleDelete(id)}>删除</Button>}></NewSPublish>
        </div>
    )
}