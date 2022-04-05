/*
 * Copyright 2022 The Kubernetes Authors
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

import Input, { Tree } from '../Input'
import { importa, importe, importd } from './1'

const snippetsInTab5: Tree = {
  name: 'snippets-in-tab5.md',
  children: [
    { name: 'Option 1: Tab1', children: [importd] },
    { name: 'Option 2: Tab2', children: [{ name: 'echo XXX' }] },
    { name: 'Option 3: Tab3', children: [importd] }
  ]
}

const prerequisites = {
  name: 'Prerequisites',
  children: [importa, importe]
}

const mainTasks = {
  name: 'Main Tasks',
  children: snippetsInTab5.children
}

const IN3: Input = {
  input: require.resolve('@kui-shell/plugin-client-common/tests/data/guidebook-tree-model3.md'),
  tree: () => [
    {
      name: snippetsInTab5.name,
      children: [prerequisites, mainTasks]
    }
  ]
}

export default IN3