
import {Button} from "antd";
import NewSPublish from "./NewSPublish";
import usePublish from "./usePublish";


export default function Unpublished() {
    const {publishList, categories, handlePublish} = usePublish(1)

    return (
        <div>
            <NewSPublish publishList={publishList} categories={categories} button={(id) => <Button type="primary" onClick={()=>handlePublish(id)}>发布</Button>}></NewSPublish>
        </div>
    )
}