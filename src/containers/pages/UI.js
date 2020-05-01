import React from "react";

import {
    Page, SectionTitle, HR, SectionHeading, SectionTitle2, FlexRow, Button, Input,
    TextBlock, ProgressBar, Radio, Scrollbar, Select, Spinner, TabbedView, Tab,
    Table, ToggleButton, FlashText, Tree, TreeWrap, TreeValue, Checkbox,
    InputButton, Leader, FormGroup
} from "ractf";


export default () => <Page>
    <SectionTitle>Really Awesome UI Framework</SectionTitle>
    <HR />
    <SectionHeading>Section Heading</SectionHeading>
    <SectionTitle2>Section title 2</SectionTitle2>
    <HR />
    <SectionTitle2>Buttons</SectionTitle2>
    <FlexRow left>
        <Button>Default</Button>
        <Button lesser>Lesser</Button>
        <Button warning>Warning</Button>
    </FlexRow>
    <FlexRow left>
        <Button disabled>Disabled</Button>
        <Button disabled lesser>Disabled Lesser</Button>
    </FlexRow>
    <FlexRow left>
        <Button large>Large</Button>
    </FlexRow>
    <ToggleButton options={[["Option 1", 1], ["Option 2", 2], ["Option 3", 3]]} default={2} />
    <HR />
    <SectionTitle2>Inputs</SectionTitle2>
    <FormGroup label={"Default"}>
        <Input placeholder={"Default"} />
    </FormGroup>
    <FormGroup label={"Limited"}>
        <Input placeholder={"Limited"} limit={15} />
    </FormGroup>
    <FormGroup label={"Disabled"}>
        <Input placeholder={"Disabled"} disabled />
    </FormGroup>
    <FormGroup label={"Multi-line"}>
        <Input placeholder={"Multi-line"} rows={3} />
    </FormGroup>
    <FormGroup label={"Password"}>
        <Input placeholder={"Password"} password />
    </FormGroup>
    <FormGroup label={"Select"}>
        <Select options={[
            { key: 0, value: "Example Select" },
            { key: 1, value: "This" },
            { key: 2, value: "is" },
            { key: 3, value: "a" },
            { key: 4, value: "dropdown" },
        ]} />
    </FormGroup>
    <FormGroup label={"Inline Submit"}>
        <InputButton placeholder={"Inline Submit"} />
    </FormGroup>
    <FormGroup label={"Disbaled Inline Submit"}>
        <InputButton placeholder={"Disbaled Inline Submit"} disabled />
    </FormGroup>
    <HR />
    <SectionTitle2>Progress Bar</SectionTitle2>
    <FlexRow>
        <ProgressBar />
        <ProgressBar progress={.25} />
        <ProgressBar progress={.50} />
        <ProgressBar progress={.75} />
        <ProgressBar progress={1} />
    </FlexRow>
    <FlexRow>
        <ProgressBar thick />
        <ProgressBar thick progress={.25} />
        <ProgressBar thick progress={.50} />
        <ProgressBar thick progress={.75} />
        <ProgressBar thick progress={1} />
    </FlexRow>
    <HR />
    <SectionTitle2>Radio</SectionTitle2>
    <Radio options={
        [["Option 1", 1], ["Option 2", 2], ["Option 3", 3]]
    } value={2} />
    <HR />
    <SectionTitle2>Checkbox</SectionTitle2>
    <Checkbox>Checkbox</Checkbox>
    <Checkbox checked>Checkbox checked</Checkbox>
    <HR />
    <SectionTitle2>Scrollbar</SectionTitle2>
    <TextBlock style={{ height: 100, overflowY: "auto" }}>
        <Scrollbar>
            This is a text block<br />
            The size has been limited to 100 pixels<br />
            The &lt;Scrollbar&gt; element was placed inside it<br />
            And then some content put inside that scrolled area<br />
            You have to scroll to see this!<br />
            Hello from below the fold!
        </Scrollbar>
    </TextBlock>
    <TextBlock style={{ height: 100, overflowY: "auto" }}>
        <Scrollbar primary>
            This is the same demo as before<br />
            But this is a primary scrollbar now<br />
            There should usually only be a single primary scrollbar<br />
            And that's the one on the right of the page<br />
            You have to scroll to see this!<br />
            Hello from below the fold!
        </Scrollbar>
    </TextBlock>
    <HR />
    <SectionTitle2>Tabbed notebook</SectionTitle2><br/>
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
    <SectionTitle2>Tables</SectionTitle2>
    <br />
    <Table headings={["Header 1", "Header 2", "Headrer 3"]} data={[
        ["Row 1, cell 1", "Row 1, Cell 2", "Row 1, Cell 3"],
        ["Row 2, cell 1", "Row 2, Cell 2", "Row 2, Cell 3"],
        ["Row 3, cell 1", "Row 3, Cell 2", "Row 3, Cell 3"],
    ]} />
    <HR />
    <SectionTitle2>Trees</SectionTitle2>
    <br />
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
    <br />
    <HR />
    <SectionTitle2>Misc</SectionTitle2>
    <TextBlock>Text block</TextBlock>
    <Spinner /><br />
    <FlashText>This is a message for the user</FlashText>
    <FlashText warning>This message is a warning</FlashText>
    <FlashText warning bold>This one's a serious warning</FlashText>
    <Leader>This leads you on somewhere</Leader>
    <Leader sub={"but this time with a subtitle!"}>This leads you on somewhere</Leader>
    This is text with <code>an inline snippet of code</code> inside it.
</Page>;
