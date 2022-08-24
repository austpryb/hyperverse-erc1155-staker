import dynamic from 'next/dynamic';
import React, { useState, useEffect } from "react";
import { styled } from '../../stitches.config';

const Editor = dynamic(() => {
  return import('./editor')
}, { ssr: false })

const ModeButton = dynamic(() => {
  return import('./button')
}, { ssr: false })


function CasbinEditor() {
  const [openedEditor, setOpenedEditor] = useState("sql");
  const [activeButton, setActiveButton] = useState("sql");

  const [sql, setSql] = useState("");
  const [js, setJs] = useState("");
  const [srcDoc, setSrcDoc] = useState(``);

  const onTabClick = (editorName) => {
    setOpenedEditor(editorName);
    setActiveButton(editorName);
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setSrcDoc(
        `
          <html>
            <body>${sql}</body>
            <script>${js}</script>
          </html>
        `
      );
    }, 250);

    return () => clearTimeout(timeOut);
  }, [sql, js]);

  return (
    <Box >
      <h3>Editor Mode</h3>
      <Section>
        <div className="tab-button-container">
          <ModeButton
            backgroundColor={activeButton === "sql" ? "blue" : ""}
            title="SQL"
            onClick={() => {
              onTabClick("sql");
            }}
          />
          <ModeButton
            backgrounColor={activeButton === "js" ? "blue" : ""}
            title="JavaScript"
            onClick={() => {
              onTabClick("js");
            }}
          />
        </div>
      </Section>

      <h3>Neutrino Editor</h3>
      <Section>
        <div className="editor editor-container">
          {openedEditor === "sql" ? (
            <Editor
              language="sql"
              displayName="SQL"
              value={sql}
              setEditorState={setSql}
            />
          ) : (
            <Editor
              language="javascript"
              displayName="JS"
              value={js}
              setEditorState={setJs}
            />
          )}
        </div>
      </Section>

      <div className="tab-button-container">
        <Button/>
      </div>

    </Box>
  );
}

export default CasbinEditor;

const Box = styled('div', {
	display: 'flex',
	overflowY: 'scroll',
	overflowX: 'hidden',
	flexDirection: 'column',
	marginTop: '1rem',
	borderRadius: '10px',
	backgroundColor: '$gray100',
	height: '70vh',
	padding: '0 2rem 2rem',
	color: '$blue500',
	'& h3': {
		marginTop: '1rem',
	},
});

const Section = styled('div', {
	marginTop: '1rem',
	display: 'grid',
	gridTemplateColumns: '1097px',
	gridGap: '10px',
});

export const Button = styled('button', {
	minWidth: '150px',
	//backgroundColor: '$yellow100',
	outline: 'none',
	border: 'none',
	padding: '10px 15px',
	borderRadius: '90px',
	cursor: 'pointer',
	margin: '10px auto -5px',
	'&:hover': {
		opacity: 0.8,
	},
});
