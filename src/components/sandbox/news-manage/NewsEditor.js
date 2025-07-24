import { Editor } from "react-draft-wysiwyg";
import { EditorState,convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {useEffect, useState} from "react";
import ContentState from "draft-js/lib/ContentState";
export default function NewsEditor(props) {
    const [editorState, setEditorState]   = useState(EditorState.createEmpty());

    // 父传子拿到的值
    useEffect(() =>{
    //     html -> draft
        if (props.content === undefined) return;  //防止创建时content为空
        const contentBlock = htmlToDraft(props.content);
        if (contentBlock){
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState)
        }
    },[props.content])
    return (
        <div>
            <Editor
                /***
                * editorState和onEditorStateChange使其变为受控组件，后续我们可以拿到编辑值，以及后续状态变化及时更新
                (editorState)=>setEditorState(editorState)每次接收到新的editorState就会显示出之前录入的信息，不加就不能输入
                */
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(newEditorState)=>setEditorState(newEditorState)}
                /***
                * onBlur事件，当失去焦点时，会触发，可以拿到编辑值，但是不能修改编辑值
                */
                onBlur={()=>{
                    /***
                     * 将editorState转为html格式，并打印出来,https://jpuri.github.io/react-draft-wysiwyg/#/demo
                     * 然后子组件中拿到html格式，传给父组件（回调父组件函数）
                     */
                    props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                }}
            />;
        </div>
    )
}