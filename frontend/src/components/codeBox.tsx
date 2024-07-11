import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { ICodeBoxProps } from '../types/ICodeBoxProps';
import '../styles/codeBox.css'

export default function CodeBox(props: ICodeBoxProps) {
  return (
    <div className='codeContainer'>
      <SyntaxHighlighter language={props.language} style={coy}>
        {props.code}
      </SyntaxHighlighter>
    </div>
  );
}
