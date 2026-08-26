import { Sparkles } from "lucide-react"
import styles from '@/sass/pages/home/chat-ai.module.scss'

const ChatAi =() =>{
    return (
     <div className={styles.chatAi}>
        <Sparkles  size={35}/>
        <span>AI</span>
     </div>
    )
}

export default ChatAi