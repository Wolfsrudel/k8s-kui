/*
 * Copyright 2021 The Kubernetes Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { REPL } from '@kui-shell/core'
import { Components } from 'react-markdown'

import _a from './a'
import p from './p'
import _div from './div'
import _img from './img'
import _code from './code'
import tabbed from './tabbed'
import _heading from './heading'
import blockquote from './blockquote'
import { list, li } from './list'
import { details, tip } from './details'
import { table, thead, tbody } from './table'

import { Props } from '../../Markdown'
import SourceOffset from './SourceOffset'

type Args = {
  mdprops: Props
  repl: REPL
  uuid: string
  spliceInCodeExecution: (replacement: string, startOffset: number, endOffset: number, codeIdx: number) => void
  codeHasBeenExecuted: (codeIdx: number) => boolean
}

function typedComponents(
  codeSourceOffsets: SourceOffset[],
  codeIdx: (offset: SourceOffset) => number,
  args: Args
): Components {
  const { mdprops, repl, uuid, spliceInCodeExecution, codeHasBeenExecuted } = args

  const a = _a(mdprops, uuid, repl)
  const div = _div(uuid)
  const img = _img(mdprops)
  const code = _code(mdprops, codeSourceOffsets, codeIdx, spliceInCodeExecution, codeHasBeenExecuted)
  const heading = _heading(uuid)

  return {
    a,
    blockquote,
    code,
    details,
    div,
    h1: heading,
    h2: heading,
    h3: heading,
    h4: heading,
    h5: heading,
    h6: heading,
    img,
    li,
    ol: list,
    p,
    table,
    thead,
    tbody,
    ul: list
  }
}

/** avoid typing issues... */
function components(args: Args) {
  // hack until we do this correctly with an AST visitor
  let codeIdx = 0
  const codeSourceOffsets: SourceOffset[] = []
  const allocCodeIdx = (offset: SourceOffset) => {
    codeSourceOffsets[codeIdx] = offset
    return codeIdx++
  }

  const components = Object.assign(
    {
      tip,
      tabbed
    },
    typedComponents(codeSourceOffsets, allocCodeIdx, args)
  )

  return function mkComponents() {
    codeIdx = 0
    return components
  }
}

export default components