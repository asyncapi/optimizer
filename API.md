## Classes

<dl>
<dt><a href="#Optimizer">Optimizer</a></dt>
<dd><p>this class is the starting point of the library.
user will only interact with this class. here we generate different kind of reports using optimizers, apply changes and return the results to the user.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#Rules">Rules</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#Options">Options</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="Optimizer"></a>

## Optimizer
this class is the starting point of the library.
user will only interact with this class. here we generate different kind of reports using optimizers, apply changes and return the results to the user.

**Kind**: global class  
**Access**: public  

* [Optimizer](#Optimizer)
    * [new Optimizer(YAMLorJSON)](#new_Optimizer_new)
    * [.getReport()](#Optimizer+getReport) ⇒ <code>Report</code>
    * [.getOptimizedDocument([Options])](#Optimizer+getOptimizedDocument) ⇒ <code>string</code>

<a name="new_Optimizer_new"></a>

### new Optimizer(YAMLorJSON)

| Param | Type | Description |
| --- | --- | --- |
| YAMLorJSON | <code>any</code> | YAML or JSON document that you want to optimize. You can pass Object, YAML or JSON version of your AsyncAPI document here. |

<a name="Optimizer+getReport"></a>

### optimizer.getReport() ⇒ <code>Report</code>
**Kind**: instance method of [<code>Optimizer</code>](#Optimizer)  
**Returns**: <code>Report</code> - an object containing all of the optimizations that the library can do.  
<a name="Optimizer+getOptimizedDocument"></a>

### optimizer.getOptimizedDocument([Options]) ⇒ <code>string</code>
This function is used to get the optimized document after seeing the report.

**Kind**: instance method of [<code>Optimizer</code>](#Optimizer)  
**Returns**: <code>string</code> - returns an stringified version of the YAML output.  

| Param | Type | Description |
| --- | --- | --- |
| [Options] | [<code>Options</code>](#Options) | the options are a way to customize the final output. |

<a name="Rules"></a>

## Rules : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [reuseComponents] | <code>Boolean</code> | whether to reuse components from `components` section or not. Defaults to `true`. |
| [removeComponents] | <code>Boolean</code> | whether to remove un-used components from `components` section or not. Defaults to `true`. |
| [moveToComponents] | <code>Boolean</code> | whether to move duplicated components to the `components` section or not. Defaults to `true`. |

<a name="Options"></a>

## Options : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| [rules] | [<code>Rules</code>](#Rules) | the list of rules that specifies which type of optimizations should be applied. |
| [output] | <code>String</code> | specifies which type of output user wants, `'JSON'` or `'YAML'`. Defaults to `'YAML'`; |

