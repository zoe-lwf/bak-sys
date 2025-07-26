
import NewSPublish from "./NewSPublish";
import usePublish from "./usePublish";
import {Button} from "antd";

export default function Published() {
    const {publishList, categories,handleSunset} = usePublish(2)
    return (
        <div>
            <NewSPublish publishList={publishList} categories={categories} button={(id)=><Button danger onClick={() => handleSunset(id)}>下线</Button>}></NewSPublish>
        </div>
    )
}