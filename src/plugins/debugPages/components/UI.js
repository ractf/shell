// Copyright (C) 2020 Really Awesome Technology Ltd
//
// This file is part of RACTF.
//
// RACTF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// RACTF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with RACTF.  If not, see <https://www.gnu.org/licenses/>.

import React from "react";
import { FiHelpCircle } from "react-icons/fi";

import {
    Page, HR, Button, Input, TextBlock, ProgressBar, Radio, Scrollbar,
    Select, Spinner, TabbedView, Tab, Table, ToggleButton, Tree,
    TreeWrap, TreeValue, Checkbox, InputButton, Leader, Card,
    SubtleText, Badge, InputGroup, InputHint, NavBar,
    NavBrand, NavGap, NavMenu, NavItem, NavCollapse,
    Footer, FootRow, FootCol, Column, Breadcrumbs, Form,
    BareForm, ItemStack, Container, /* ColourPicker, PalettePicker */
} from "@ractf/ui-kit";
import { TYPES } from "@ractf/util";
import { zxcvbn } from "@ractf/shell-util";

import Link from "components/Link";


const Inner = () => (<NavCollapse>
    <NavItem><Link to={"#"}>Home</Link></NavItem>
    <NavItem><Link to={"#"}>About</Link></NavItem>
    <NavItem><Link to={"#"}>Get Started</Link></NavItem>
    <NavItem><Link to={"#"}>API Reference</Link></NavItem>

    <NavGap />

    <NavMenu name={"More"}>
        <Link to={"#"}>Test</Link>
        <Link to={"#"}>Test</Link>
        <Link to={"#"}>Test</Link>

        <NavMenu name={"More"}>
            <Link to={"#"}>Test</Link>
            <Link to={"#"}>Test</Link>
            <NavMenu name={"More"}>
                <Link to={"#"}>Test</Link>

                <NavMenu name={"More"}>
                    <Link to={"#"}>Test</Link>
                    <Link to={"#"}>Test</Link>
                    <Link to={"#"}>Test</Link>
                </NavMenu>

                <Link to={"#"}>Test</Link>
                <Link to={"#"}>Test</Link>
            </NavMenu>

            <Link to={"#"}>Test</Link>
        </NavMenu>
    </NavMenu>
</NavCollapse>);

const UIPage = () => <Page>
    {/* <ColourPicker />
    <PalettePicker /> */}
    <HR />
    <HR />
    <HR />
    <h1>Really Awesome UI Framework</h1>
    <HR />
    <h2>Nav Bars</h2>
    <NavBar>
        <NavBrand>RACTF/<b>UI-KIT</b></NavBrand>
        <NavCollapse>
            <NavItem><Link to={"#"}>Home</Link></NavItem>
            <NavItem><Link to={"#"}>About</Link></NavItem>
            <NavItem><Link to={"#"}>Get Started</Link></NavItem>
            <NavItem><Link to={"#"}>API Reference</Link></NavItem>

            <NavGap />
            <NavItem>This is some text</NavItem>
            <NavGap />
            <BareForm>
                <Input placeholder={"Search"} />
            </BareForm>
        </NavCollapse>
    </NavBar>
    <NavBar primary>
        <NavBrand>Primary</NavBrand>
        <Inner />
    </NavBar>
    <NavBar secondary>
        <NavBrand>Secondary</NavBrand>
        <Inner />
    </NavBar>
    <NavBar success>
        <NavBrand>Success</NavBrand>
        <Inner />
    </NavBar>
    <NavBar info>
        <NavBrand>Info</NavBrand>
        <Inner />
    </NavBar>
    <NavBar warning>
        <NavBrand>Warning</NavBrand>
        <Inner />
    </NavBar>
    <NavBar danger>
        <NavBrand>Danger</NavBrand>
        <Inner />
    </NavBar>
    <HR />
    <Breadcrumbs>
        <Breadcrumbs.Crumb><Link to={"#"}>You</Link></Breadcrumbs.Crumb>
        <Breadcrumbs.Crumb><Link to={"#"}>Are</Link></Breadcrumbs.Crumb>
        <Breadcrumbs.Crumb>Here!</Breadcrumbs.Crumb>
    </Breadcrumbs>
    <HR />
    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <h4>Heading 4</h4>
    <h5>Heading 5</h5>
    <h6>Heading 6</h6>
    <HR />

    <Container toolbar>
        {TYPES.map(type => (
            <Button Icon={FiHelpCircle} tooltip={`This is a ${type} button`}
                {...{ [type]: true }} key={type}>{type}</Button>
        ))}
    </Container>

    <HR />
    <h2>Badges</h2>
    <Container.Row>
        <Column lgWidth={6} mdWidth={12}>
            <Container toolbar>
                {TYPES.map(type => (
                    <Badge {...{ [type]: true }} key={type}>{type}</Badge>
                ))}
            </Container>
        </Column>
        <Column lgWidth={6} mdWidth={12}>
            <Container toolbar>
                {TYPES.map(type => (
                    <Badge pill {...{ [type]: true }} key={type}>{type}</Badge>
                ))}
            </Container>
        </Column>
    </Container.Row>
    <HR />
    <h2>Buttons</h2>
    <Container.Row>
        <Column lgWidth={6} mdWidth={12}>
            <Container toolbar spaced>
                {TYPES.map(type => (
                    <Button {...{ [type]: true }} key={type}>{type}</Button>
                ))}
            </Container>
            <Container toolbar spaced>
                {TYPES.map(type => (
                    <Button disabled {...{ [type]: true }} key={type}>{type}</Button>
                ))}
            </Container>
            <Container toolbar spaced>
                {TYPES.map(type => (
                    <Button lesser {...{ [type]: true }} key={type}>{type}</Button>
                ))}
            </Container>
            <Container toolbar spaced>
                <Button large>Large</Button>
            </Container>
            <Container spaced>
                <ToggleButton
                    options={[["Option 1", 1], ["Option 2", 2], ["Option 3", 3], ["Option 4", 4], ["Option 5", 5]]}
                    default={2} />
            </Container>
            <Container toolbar spaced>
                <ToggleButton small
                    options={[["<", 0], ["1", 1], ["2", 2], ["3", 3], ["4", 4], ["5", 5], [">", 6]]}
                    default={2} />
                <SubtleText>Items per page:</SubtleText>
                <Select mini options={[10, 25, 50, 100]} />
            </Container>
        </Column>
        <Column lgWidth={6} mdWidth={12}>
            <Container toolbar spaced>
                {TYPES.map(type => (
                    <Button pill {...{ [type]: true }} key={type}>{type}</Button>
                ))}
            </Container>
            <Container toolbar spaced>
                {TYPES.map(type => (
                    <Button pill disabled {...{ [type]: true }} key={type}>{type}</Button>
                ))}
            </Container>
            <Container toolbar spaced>
                {TYPES.map(type => (
                    <Button pill lesser {...{ [type]: true }} key={type}>{type}</Button>
                ))}
            </Container>
            <Container toolbar spaced>
                <Button pill large>Large</Button>
            </Container>
            <Container spaced>
                <ToggleButton pill
                    options={[["Option 1", 1], ["Option 2", 2], ["Option 3", 3], ["Option 4", 4], ["Option 5", 5]]}
                    default={2} />
            </Container>
            <Container toolbar spaced>
                <ToggleButton pill small
                    options={[["<", 0], ["1", 1], ["2", 2], ["3", 3], ["4", 4], ["5", 5], [">", 6]]}
                    default={2} />
                <SubtleText>Items per page:</SubtleText>
                <Select pill mini options={[10, 25, 50, 100]} />
            </Container>
        </Column>
    </Container.Row>
    <HR />
    <h2>Inputs</h2>
    <Container.Row>
        <Column lgWidth={6}>
            <Form>
                <Form.Group label={"Basic Inputs"}>
                    <Input name="def" placeholder={"Default"} />
                    <Input name="inv" placeholder={"Invalid"} error />
                    <Input name="lim" placeholder={"Limited"} limit={15} />
                    <Input name="mul" placeholder={"Multi-line"} rows={3} />
                    <Input name="pas" placeholder={"Password"} password />
                    <Input name="pst" zxcvbn={zxcvbn()} placeholder={"Password with strength"} password />
                </Form.Group>
                <Form.Group label={"Select"}>
                    <Select options={[
                        { key: 0, value: "Example Select" },
                        { key: 1, value: "This" },
                        { key: 2, value: "is" },
                        { key: 3, value: "a" },
                        { key: 4, value: "dropdown" },
                    ]} />
                </Form.Group>
            </Form>
        </Column>
        <Column lgWidth={6}>
            <Form locked>
                <Form.Group label={"Disabled"}>
                    <Input name="dis" placeholder={"Disabled"} />
                </Form.Group>
            </Form>
            <Form>
                <Form.Group label={"Input Groups"}>
                    <InputButton name="inl" placeholder={"Inline Submit"} />
                    <InputGroup name="ing" left={
                        <InputHint>@</InputHint>
                    } right={<>
                        <Button success>Add New</Button>
                        <Button danger>Remove</Button>
                    </>} />
                </Form.Group>
            </Form>
            <Form locked>
                <Form.Group label={"Disabled Input Groups"}>
                    <InputButton name="din" placeholder={"Disabled Inline Submit"} />
                    <InputGroup name="dig" left={
                        <InputHint>@</InputHint>
                    } right={<>
                        <Button disabled success>Add New</Button>
                        <Button disabled danger>Remove</Button>
                    </>} />
                </Form.Group>
            </Form>
        </Column>
    </Container.Row>
    <HR />
    <h2>Progress Bar</h2>
    <Container.Row>
        <Column lgWidth={6}>
            <ProgressBar />
            <ProgressBar progress={.25} />
            <ProgressBar progress={.50} />
            <ProgressBar progress={.75} />
            <ProgressBar progress={1} />
        </Column>
        <Column lgWidth={6}>
            <ProgressBar thick />
            <ProgressBar thick progress={.25} />
            <ProgressBar thick progress={.50} />
            <ProgressBar thick progress={.75} />
            <ProgressBar thick progress={1} />
        </Column>
    </Container.Row>
    <HR />
    <Container.Row>
        <Column lgWidth={6}>
            <h2>Radio</h2>
            <Form>
                <Radio name="demoRadio" options={
                    [["Option 1", 1], ["Option 2", 2], ["Option 3", 3]]
                } val={2} />
            </Form>
        </Column>
        <Column lgWidth={6}>
            <h2>Checkbox</h2>
            <Form>
                <Checkbox name="cb1">Checkbox</Checkbox>
                <Checkbox name="cb2" val={true}>Checkbox checked</Checkbox>
            </Form>
        </Column>
    </Container.Row>
    <HR />
    <h2>Scrollbar</h2>
    <Container.Row>
        <Column lgWidth={6}>
            <TextBlock style={{ height: 100 }}>
                <Scrollbar>
                    This is a text block<br />
                The size has been limited to 100 pixels<br />
                The &lt;Scrollbar&gt; element was placed inside it<br />
                And then some content put inside that scrolled area<br />
                You have to scroll to see this!<br />
                Hello from below the fold!
            </Scrollbar>
            </TextBlock>
        </Column>
    <Column lgWidth={6}>
            <TextBlock>
                <Scrollbar height={100} primary>
                    This is the same demo as before<br />
                But this is a primary scrollbar now<br />
                There should usually only be a single primary scrollbar<br />
                And that's the one on the right of the page<br />
                You have to scroll to see this!<br />
                Hello from below the fold!
            </Scrollbar>
            </TextBlock>
        </Column>
    </Container.Row>
    <HR />
    <h2>Tabbed notebook</h2>
    <TabbedView>
        <Tab label={"Tab 1"}>
            Welcome to my tabbed notebook<br />
            You can put anything you want here.
        </Tab>
        <Tab label={"Tab 2"}>
            This is a spicy
        </Tab>
    </TabbedView>
    <HR />
    <h2>Tables</h2>
    <Table headings={["Header 1", "Header 2", "Header 3"]} data={[
        ["Row 1, cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
        ["Row 2, cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
        ["Row 3, cell 1", "Row 3, Cell 2", "Row 3, Cell 3", { type: "primary" }],
        ["Row 4, cell 1", "Row 4, Cell 2", "Row 4, Cell 3", { type: "secondary" }],
        ["Row 5, cell 1", "Row 5, Cell 2", "Row 5, Cell 3", { type: "success" }],
        ["Row 6, cell 1", "Row 6, Cell 2", "Row 6, Cell 3", { type: "info" }],
        ["Row 7, cell 1", "Row 7, Cell 2", "Row 7, Cell 3", { type: "warning" }],
        ["Row 8, cell 1", "Row 8, Cell 2", "Row 8, Cell 3", { type: "danger" }],
    ]} />
    <HR />
    <h2>Trees</h2>
    <TreeWrap>
        <Tree name="Folder">
            <TreeValue name="Read-only" value="yes" />
            <Tree name="Nested folder">
                <TreeValue name="Deeper value" value="value" />
            </Tree>
        </Tree>
        <Tree name="Open folder" startOpen>
            <TreeValue setValue={() => 0} name="Editable value" value="Edits won't actually occur" />
        </Tree>
    </TreeWrap>
    <HR />
    <h2>Card</h2>
    <Container.Row>
        <Column>
            <Card header={"Card header"} title={"Card title"} light>Hi there!</Card>
        </Column>
        <Column lgWidth={6}>
            <Card header={"Card header"} title={"Card title"} primary>Hi there!</Card>
        </Column>
        <Column lgWidth={6}>
            <Card header={"Card header"} title={"Card title"} secondary>Hi there!</Card>
        </Column>
        <Column lgWidth={6}>
            <Card header={"Card header"} title={"Card title"} success>Hi there!</Card>
        </Column>
        <Column lgWidth={6}>
            <Card header={"Card header"} title={"Card title"} info>Hi there!</Card>
        </Column>
        <Column lgWidth={6}>
            <Card header={"Card header"} title={"Card title"} warning>Hi there!</Card>
        </Column>
        <Column lgWidth={6}>
            <Card header={"Card header"} title={"Card title"} danger>Hi there!</Card>
        </Column>
        <Column lgWidth={4}>
            <Card lesser header={"Card header"} title={"Card title"} info>Hi there!</Card>
        </Column>
        <Column lgWidth={4}>
            <Card lesser header={"Card header"} title={"Card title"} warning>Hi there!</Card>
        </Column>
        <Column lgWidth={4}>
            <Card lesser header={"Card header"} title={"Card title"} danger>Hi there!</Card>
        </Column>
    </Container.Row>
    <HR />
    <h2>Misc</h2>
    <TextBlock>Text block</TextBlock>
    <Container spaced full centre>
        <Spinner />
    </Container>
    <Leader>This leads you on somewhere</Leader>
    <Leader sub={"but this time with a subtitle!"}>This leads you on somewhere</Leader>
    <p>This is text with <code>an inline snippet of code</code> inside it.</p>
    <SubtleText>Subtle text</SubtleText>
    <Card lesser noPad>
        <ItemStack>
            <ItemStack.Item warning label={5}>Some</ItemStack.Item>
            <ItemStack.Item success active>Item</ItemStack.Item>
            <ItemStack.Item primary>Here!</ItemStack.Item>
            <ItemStack.Item>Here!</ItemStack.Item>
        </ItemStack>
    </Card>
    <HR />
    <h2>Footer</h2>
    <Footer>
        <FootRow primary>
            <p>This is a primary row</p>
        </FootRow>
        <FootRow warning>
            <p>This is a warning row</p>
        </FootRow>
        <FootRow success>
            <p>You've seen these colours enough times.</p>
        </FootRow>
        <FootRow main>
            <FootCol title={"Hi there!"}>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                </p>
            </FootCol>
            <FootCol title={"RACTF"}>
                <Link to={"#"}>Home</Link>
                <Link to={"#"}>About</Link>
                <Link to={"#"}>Get Started</Link>
                <Link to={"#"}>API Reference</Link>
            </FootCol>
            <FootCol title={"Get in Touch"}>
                <Link to={"#"}>Twitter</Link>
                <Link to={"#"}>Email</Link>
                <Link to={"#"}>Discord</Link>
            </FootCol>
        </FootRow>
        <FootRow center slim darken>
            &copy; 2020 RACTF
        </FootRow>
        <FootRow right danger>
            <p>These rows can go in any order!</p>
        </FootRow>
    </Footer>
</Page>;
export default UIPage;
