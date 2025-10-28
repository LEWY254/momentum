//fetch chats from the db. Display them by conversation title in a bar
//When the user clicks the bar the convo is loaded
//means i need to impliment a way to summarise or get a title from the users input
import {useLiveQuery} from "dexie-react-hooks"
import useStore from "@/lib/store/store.ts";
 import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  ListGroup,
  ListProvider,
  ListItem,
  ListItems,
  ListHeader,
} from "@/components/ui/shadcn-io/list";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  Response,
  PromptInput,
  PromptInputTextarea,
} from "@/components/ui/shadcn-io/ai/message";
import { useState } from "react";

interface ChatUIProps {
  isOpen: boolean;
  data: {}[];
}
export default function ChatBot() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  return (
    <>
      <div className="chat-ui">
        <Button onClick={setIsDrawerOpen((prev) => !prev)}>sidebar</Button>
        //renders a list of conversation titles from the db,when either is
        clicked, it renders a chat with the conversation id
        <ChatUI isOpen={isDrawerOpen} data={} />
      </div>
    </>
  );
}

//The data from the db could be stored in global state so i dont have to pass props every now and then
const SideBar = ({
  conversation_list,
  onSelection,
}: {
  conversation_list: {conversation_id: string, id: number,conversation_title:string}[];
  onSelection: any;
}) => {
  return (
    <>
      <ListGroup>
        <ListItems>
          {conversation_list.map((conversation) => (
            <ListItem id={conversation.id}>
              <span
                className="convesation-title"
                onClick={() => onSelection(conversation.conversation_id)}
              >
                {conversation.conversation_title}
              </span>
            </ListItem>
          ))}
        </ListItems>
      </ListGroup>
    </>
  );
};
function ChatContent(conversation_id: { conversation_id: string }) {
  //use the conversation_id to get data from global state
  const [input, setInput] = useState<string>("");
  const messages=useStore((state) => state.fetchMessages(conversation_id));
  return (
    <>
      <Conversation>
        <ConversationContent>
          {messages.map((message) => (
            <Message>
              <MessageContent from={message.role} key={message.id}>
                <Response>{message.content}</Response>
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
      </Conversation>
      <PromptInput onSubmit={submitPrompt}>
        <PromptInputTextarea
          value={input}
          placeholder="What do you want to talk about"
          onChange={(e) => setInput(e.currentTarget.value)}
        />
      </PromptInput>
    </>
  );
}
const ChatUI = ({ isOpen, data }: ChatUIProps) => {
  //a list of names for the conversation
  const [conversation_list, setConversationList] = useState<{conversation_id: string, id: number,conversation_title:string}[]>([]);
  const [active_conversation, setActiveConversation] = useState<string>("");
  return (
    <>
      <div className="drawer">
        <Drawer>
          <DrawerTrigger>
            <Button>SideBar</Button>
          </DrawerTrigger>
          <DrawerContent>
            <SideBar
              conversation_list={conversation_list}
              onSelection={setActiveConversation}
            />
          </DrawerContent>
        </Drawer>
        <ChatContent conversation_id={active_conversation} />
      </div>
    </>
  );
};
