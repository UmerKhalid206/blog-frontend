import React, { useState } from 'react';
import {userStore} from '../Zustand/zustand'


const reactionEmojis = [
  { emoji: '👍', name: 'like', id: 1},
  { emoji: '😢', name: 'sad', id: 4 }
];

const ReactionsPicker = ({id}) => {

    const [selectedReaction, setSelectedReaction] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    const reaction = userStore((state) => state.changeReaction);
    const decoded = userStore((state) => state.fetchDecoded);
    


    const Server = process.env.NEXT_PUBLIC_SERVER
    const handleReactionClick = async (emoji) => {
      setIsFetching(true)
        const decoded_data = await decoded()
        if(decoded_data){
            const token = decoded_data.value
            const settings = {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    blog_id: id,
                    reaction: emoji.name,
                }),
            };
            let res:any = await fetch(`${Server}/reactions`, settings)
            if(res.ok === true){
              setIsFetching(false)
            }
            res = await res.json()
            console.log("response of reaction",res)
        }
      setSelectedReaction(emoji);
      reaction(emoji.name)

    };
  
    return (
      <div className="reactions-container">
        <div className="reactions-picker">
          {isFetching === false ? reactionEmojis.map((emoji, index) => (
            <button
              disabled={isFetching}
              key={index}
              className={`reaction ${selectedReaction === emoji ? 'selected' : ''}`}
              onClick={() => handleReactionClick(emoji)}
            >
              {emoji.emoji}
            </button>
          ))
        : null}
        </div>
  
        {/* {selectedReaction && (
          <div className="selected-reaction">
            <p>Selected Reaction: {selectedReaction.emoji}</p>
          </div>
        )} */}
      </div>
    );
  };
  
  export default ReactionsPicker;
  