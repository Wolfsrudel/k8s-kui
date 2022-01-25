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

import React from 'react'
import { encodeComponent, i18n, pexecInCurrentTab } from '@kui-shell/core'
import { PageSidebar } from '@patternfly/react-core'

import CommonProps from './props/Common'
import BrandingProps from './props/Branding'
import GuidebookProps, { isGuidebook, isMenu, MenuItem } from './props/Guidebooks'

import '../../../web/scss/components/Sidebar/_index.scss'

const Nav = React.lazy(() => import('@patternfly/react-core').then(_ => ({ default: _.Nav })))
const NavItem = React.lazy(() => import('@patternfly/react-core').then(_ => ({ default: _.NavItem })))
const NavList = React.lazy(() => import('@patternfly/react-core').then(_ => ({ default: _.NavList })))
const NavExpandable = React.lazy(() => import('@patternfly/react-core').then(_ => ({ default: _.NavExpandable })))

const strings = i18n('plugin-client-common')

type Props = Pick<CommonProps, 'noTopTabs'> &
  BrandingProps &
  GuidebookProps & {
    /** unfurled? */
    isOpen: boolean

    /** visually indicate which nav item is active? */
    indicateActiveItem?: boolean

    /** toggle open state */
    toggleOpen(): void
  }

interface State {
  /** in noTopTabs mode, we indicate selected guidebook in the NavItem below */
  currentGuidebook?: string
}

export default class Sidebar extends React.PureComponent<Props, State> {
  private readonly cleaners: (() => void)[] = []

  public constructor(props: Props) {
    super(props)
    this.state = {}
  }

  private get currentGuidebook() {
    return this.state.currentGuidebook
  }

  private readonly onKeyup = (evt: KeyboardEvent) => {
    if (evt.key === 'Escape') {
      this.props.toggleOpen()
    }
  }

  public componentDidMount() {
    document.addEventListener('keyup', this.onKeyup)
    this.cleaners.push(() => document.removeEventListener('keyup', this.onKeyup))
  }

  public componentWillUnmount() {
    this.cleaners.forEach(_ => _())
  }

  private nav() {
    // helps deal with isActive; if we don't have a currentGuidebook,
    // use the first one (for now)
    let first = !this.currentGuidebook

    const renderItem = (_: MenuItem, idx) => {
      const thisIsTheFirstNavItem = isGuidebook(_) && first
      if (thisIsTheFirstNavItem) {
        first = false
      }

      return isGuidebook(_) ? (
        <NavItem
          key={idx}
          data-title={_.notebook}
          className="kui--sidebar-nav-item"
          isActive={this.props.indicateActiveItem && (_.notebook === this.currentGuidebook || thisIsTheFirstNavItem)}
          onClick={() => {
            const quiet = !this.props.noTopTabs
            pexecInCurrentTab(
              `${this.props.guidebooksCommand || 'replay'} ${encodeComponent(_.filepath)}`,
              undefined,
              quiet
            )
            this.setState({ currentGuidebook: _.notebook })
          }}
        >
          {_.notebook}
        </NavItem>
      ) : isMenu(_) ? (
        <NavExpandable key={idx} isExpanded title={_.label} className="kui--sidebar-nav-menu" data-title={_.label}>
          {_.submenu.map(renderItem)}
        </NavExpandable>
      ) : (
        undefined
      )
    }

    return (
      <React.Suspense fallback={<div />}>
        <Nav className="kui--tab-container-sidebar-nav">
          <NavList>{this.props.guidebooks.map(renderItem)}</NavList>
        </Nav>
        {this.props.productName && this.props.version && (
          <div className="kui--tab-container-sidebar-other flex-layout">
            <span className="flex-fill sub-text">{strings('Toggle via <Esc>')}</span>
            <span className="inline-flex flex-align-end semi-bold">v{this.props.version}</span>
          </div>
        )}
      </React.Suspense>
    )
  }

  public render() {
    return (
      <PageSidebar
        nav={this.props.isOpen && this.nav()}
        isNavOpen={this.props.isOpen}
        className="kui--tab-container-sidebar"
      />
    )
  }
}