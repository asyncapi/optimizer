## Classes

<dl>
<dt><a href="#Optimizer">Optimizer</a></dt>
<dd><p>this class is the starting point of the library.
user will only interact with this class. here we generate different kind of reports using optimizers, apply changes and return the results to the user.</p>
</dd>
<dt><a href="#ComponentProvider">ComponentProvider</a></dt>
<dd><p>This class will provide all sorts of data for optimizers.</p>
</dd>
<dt><a href="#MoveToComponents">MoveToComponents</a></dt>
<dd><p>This optimizer will find all of the components that are duplicated in <em>channels</em> section of the AsyncAPI spec and can be moved to <em>components</em> section and reused.</p>
</dd>
<dt><a href="#RemoveComponents">RemoveComponents</a></dt>
<dd><p>This optimizer will find all of the components that are declared in <em>components</em> section of the AsyncAPI spec but are not used anywhere. So they can be deleted.</p>
</dd>
<dt><a href="#ReuseComponents">ReuseComponents</a></dt>
<dd><p>This optimizer will find all of the components that are declared in <em>components</em> section of the AsyncAPI spec that can be reused in other part of the spec and generate a detailed report of them.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#compareComponents">compareComponents(x, y)</a> ⇒ <code>boolean</code></dt>
<dd><p>Compares two components.</p>
</dd>
<dt><a href="#isExtension">isExtension(fieldName)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if the field is an extention by checking its name.</p>
</dd>
<dt><a href="#compareComponents">compareComponents(x, y)</a> ⇒ <code>boolean</code></dt>
<dd><p>Compares two components.</p>
</dd>
<dt><a href="#isEqual">isEqual(component1, component2, referentialEqualityCheck)</a> ⇒ <code>boolean</code></dt>
<dd><p>Compares two components but also considers equality check. the referential equality check can be disabled by referentialEqualityCheck argument.</p>
</dd>
<dt><a href="#isInComponents">isInComponents(path)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if the component is located in <code>components</code> section of the file by its path.</p>
</dd>
<dt><a href="#isInChannels">isInChannels(path)</a> ⇒ <code>boolean</code></dt>
<dd><p>Checks if the component is located in <code>channels</code> section of the file by its path.</p>
</dd>
</dl>

<a name="Optimizer"></a>

## Optimizer
this class is the starting point of the library.
user will only interact with this class. here we generate different kind of reports using optimizers, apply changes and return the results to the user.

**Kind**: global class  
**Access**: public  

* [Optimizer](#Optimizer)
    * [.getReport()](#Optimizer+getReport) ⇒ <code>Report</code>
    * [.sortFunction()](#Optimizer+sortFunction)
    * [.getOptimizedDocument(options)](#Optimizer+getOptimizedDocument) ⇒ <code>string</code>
    * [.removeEmptyParent(childPath)](#Optimizer+removeEmptyParent) ⇒ <code>void</code>
    * [.hasParent(childPath)](#Optimizer+hasParent) ⇒ <code>void</code>
    * [.applyChanges(changes)](#Optimizer+applyChanges) ⇒ <code>void</code>

<a name="Optimizer+getReport"></a>

### optimizer.getReport() ⇒ <code>Report</code>
**Kind**: instance method of [<code>Optimizer</code>](#Optimizer)  
**Returns**: <code>Report</code> - an object containing all of the optimizations that the library can do.  
**Access**: public  
<a name="Optimizer+sortFunction"></a>

### optimizer.sortFunction()
this sort function can be used by .sort function to sort the [ReportElement](ReportElement) arrays.

**Kind**: instance method of [<code>Optimizer</code>](#Optimizer)  
<a name="Optimizer+getOptimizedDocument"></a>

### optimizer.getOptimizedDocument(options) ⇒ <code>string</code>
This function is used to get the optimized document after seeing the report.

**Kind**: instance method of [<code>Optimizer</code>](#Optimizer)  
**Returns**: <code>string</code> - returns an stringified version of the YAML output.  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>Options</code> | the options are a way to customize the final output. |

<a name="Optimizer+removeEmptyParent"></a>

### optimizer.removeEmptyParent(childPath) ⇒ <code>void</code>
Sometimes removing and optimizing components leaves the parent empty and an empty object is of no use. this function
checks if the parent is empty or not, if empty it will remove it.

**Kind**: instance method of [<code>Optimizer</code>](#Optimizer)  

| Param | Type | Description |
| --- | --- | --- |
| childPath | <code>string</code> | the path of the child that we need to check its parent. |

<a name="Optimizer+hasParent"></a>

### optimizer.hasParent(childPath) ⇒ <code>void</code>
this function will check if a component has parent or is a $ref to another component.

**Kind**: instance method of [<code>Optimizer</code>](#Optimizer)  

| Param | Type | Description |
| --- | --- | --- |
| childPath | <code>string</code> | the path of child. |

<a name="Optimizer+applyChanges"></a>

### optimizer.applyChanges(changes) ⇒ <code>void</code>
This function is used to apply an array of [ReportElement](ReportElement) changes on the result.

**Kind**: instance method of [<code>Optimizer</code>](#Optimizer)  

| Param | Type | Description |
| --- | --- | --- |
| changes | <code>Array.&lt;ReportElement&gt;</code> | A list of changes that needs to be applied. |

<a name="ComponentProvider"></a>

## ComponentProvider
This class will provide all sorts of data for optimizers.

**Kind**: global class  
**Access**: public  

* [ComponentProvider](#ComponentProvider)
    * [.scanChannels()](#ComponentProvider+scanChannels) ⇒ <code>void</code>
    * [.scanSchema(path, schema)](#ComponentProvider+scanSchema) ⇒ <code>void</code>
    * [.isInTraits(type, childComponent, parent)](#ComponentProvider+isInTraits) ⇒ <code>ComponentStatus</code>
    * [.scanInTrait(name, child, parent, path)](#ComponentProvider+scanInTrait) ⇒ <code>void</code>
    * [.handlePossibleInTraitsComponents(name, parentPath, child, parent)](#ComponentProvider+handlePossibleInTraitsComponents) ⇒ <code>void</code>
    * [.scanMessage(path, message)](#ComponentProvider+scanMessage) ⇒ <code>void</code>
    * [.scanComponents()](#ComponentProvider+scanComponents) ⇒ <code>void</code>

<a name="ComponentProvider+scanChannels"></a>

### componentProvider.scanChannels() ⇒ <code>void</code>
This function is responsible for scanning the document's channels section.

**Kind**: instance method of [<code>ComponentProvider</code>](#ComponentProvider)  
<a name="ComponentProvider+scanSchema"></a>

### componentProvider.scanSchema(path, schema) ⇒ <code>void</code>
This function is responsible for scanning any schema that is passed to it.

**Kind**: instance method of [<code>ComponentProvider</code>](#ComponentProvider)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | path of the schema that needs to be scanned. |
| schema | <code>Schema</code> | the actual schema object. |

<a name="ComponentProvider+isInTraits"></a>

### componentProvider.isInTraits(type, childComponent, parent) ⇒ <code>ComponentStatus</code>
This function will determine if a component is in its respective traits or not.

**Kind**: instance method of [<code>ComponentProvider</code>](#ComponentProvider)  
**Returns**: <code>ComponentStatus</code> - Returns the location of the component.  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | A string to pass the name of the child component. it should be the field name that is passed in childComponent field. |
| childComponent | <code>any</code> | this is the child component that needs to be checked. |
| parent | <code>any</code> | this is the childComponent's parent. it should contain traits filed. |

**Example**  
```js
isInTraits('payload', payload, message)
```
<a name="ComponentProvider+scanInTrait"></a>

### componentProvider.scanInTrait(name, child, parent, path) ⇒ <code>void</code>
This function will scan a component by name from traits of another component.

**Kind**: instance method of [<code>ComponentProvider</code>](#ComponentProvider)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the component that needs to be extracted from traits. |
| child | <code>any</code> | the child that needs to be scanned. |
| parent | <code>any</code> | this is the parent. it should contain traits to be scanned. |
| path | <code>string</code> | path of the parent. |

**Example**  
```js
scanInTrait('payload', payload, message, path)
```
<a name="ComponentProvider+handlePossibleInTraitsComponents"></a>

### componentProvider.handlePossibleInTraitsComponents(name, parentPath, child, parent) ⇒ <code>void</code>
This function will handle the cases which it is possible that the values of a
field is coming from a trait.

**Kind**: instance method of [<code>ComponentProvider</code>](#ComponentProvider)  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | the name of the component that needs to be extracted from traits. |
| parentPath | <code>string</code> | path of the parent. |
| child | <code>any</code> | the child that needs to be scanned. |
| parent | <code>any</code> | this is the parent. it should contain traits to be scanned. |

**Example**  
```js
handlePossibleInTraitsComponents('payload', path, payload, message)
```
<a name="ComponentProvider+scanMessage"></a>

### componentProvider.scanMessage(path, message) ⇒ <code>void</code>
This function is responsible for scanning any message that is passed to it.

**Kind**: instance method of [<code>ComponentProvider</code>](#ComponentProvider)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | path of the message that needs to be scanned. |
| message | <code>Message</code> | the actual message object. |

<a name="ComponentProvider+scanComponents"></a>

### componentProvider.scanComponents() ⇒ <code>void</code>
This function is responsible for scanning the document's components section.

**Kind**: instance method of [<code>ComponentProvider</code>](#ComponentProvider)  
<a name="MoveToComponents"></a>

## MoveToComponents
This optimizer will find all of the components that are duplicated in _channels_ section of the AsyncAPI spec and can be moved to _components_ section and reused.

**Kind**: global class  
**Access**: public  
<a name="MoveToComponents+getReport"></a>

### moveToComponents.getReport() ⇒ <code>Array.&lt;ReportElement&gt;</code>
After initializing this class, getReport function can be used to generate a report of components that are duplicated and can be moved to _components_ section.

**Kind**: instance method of [<code>MoveToComponents</code>](#MoveToComponents)  
**Returns**: <code>Array.&lt;ReportElement&gt;</code> - a list of all the components that can be moved to _components_.  
<a name="RemoveComponents"></a>

## RemoveComponents
This optimizer will find all of the components that are declared in _components_ section of the AsyncAPI spec but are not used anywhere. So they can be deleted.

**Kind**: global class  
**Access**: public  
<a name="RemoveComponents+getReport"></a>

### removeComponents.getReport() ⇒ <code>Array.&lt;ReportElement&gt;</code>
After initializing this class, getReport function can be used to generate a report of components that can be deleted since they are declared but are not used.

**Kind**: instance method of [<code>RemoveComponents</code>](#RemoveComponents)  
**Returns**: <code>Array.&lt;ReportElement&gt;</code> - a list of all the components that can be removed.  
<a name="ReuseComponents"></a>

## ReuseComponents
This optimizer will find all of the components that are declared in _components_ section of the AsyncAPI spec that can be reused in other part of the spec and generate a detailed report of them.

**Kind**: global class  
**Access**: public  
<a name="ReuseComponents+getReport"></a>

### reuseComponents.getReport() ⇒ <code>Array.&lt;ReportElement&gt;</code>
After initializing this class, getReport function can be used to generate a report of components that can be reused.

**Kind**: instance method of [<code>ReuseComponents</code>](#ReuseComponents)  
**Returns**: <code>Array.&lt;ReportElement&gt;</code> - a list of elements that can be reused.  
<a name="compareComponents"></a>

## compareComponents(x, y) ⇒ <code>boolean</code>
Compares two components.

**Kind**: global function  
**Returns**: <code>boolean</code> - true, if both components are identical; false, if the components are not identical.  
**Remarks**: this recursive function is responsible for comparing two component.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>any</code> | the first component that we are going to compare. |
| y | <code>any</code> | the second component that we are going to compare. |

<a name="isExtension"></a>

## isExtension(fieldName) ⇒ <code>boolean</code>
Checks if the field is an extention by checking its name.

**Kind**: global function  
**Returns**: <code>boolean</code> - true, if the field is an extension.  

| Param | Type | Description |
| --- | --- | --- |
| fieldName | <code>string</code> | the name of the field. |

<a name="compareComponents"></a>

## compareComponents(x, y) ⇒ <code>boolean</code>
Compares two components.

**Kind**: global function  
**Returns**: <code>boolean</code> - true, if both components are identical; false, if the components are not identical.  
**Remarks**: this recursive function is responsible for comparing two component.  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>any</code> | the first component that we are going to compare. |
| y | <code>any</code> | the second component that we are going to compare. |

<a name="isEqual"></a>

## isEqual(component1, component2, referentialEqualityCheck) ⇒ <code>boolean</code>
Compares two components but also considers equality check. the referential equality check can be disabled by referentialEqualityCheck argument.

**Kind**: global function  
**Returns**: <code>boolean</code> - true, if both components are equal; false, if the components are not equal.  

| Param | Type | Description |
| --- | --- | --- |
| component1 | <code>any</code> | the first component that we are going to compare. |
| component2 | <code>any</code> | the second component that we are going to compare. |
| referentialEqualityCheck | <code>boolean</code> | this argument controls whether the referential equality should be checked or not. |

<a name="isInComponents"></a>

## isInComponents(path) ⇒ <code>boolean</code>
Checks if the component is located in `components` section of the file by its path.

**Kind**: global function  
**Returns**: <code>boolean</code> - true, if the component is located in `components` section of the file.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | the path of the component. |

<a name="isInChannels"></a>

## isInChannels(path) ⇒ <code>boolean</code>
Checks if the component is located in `channels` section of the file by its path.

**Kind**: global function  
**Returns**: <code>boolean</code> - true, if the component is located in `channels` section of the file.  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | the path of the component. |

