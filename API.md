<a name="Optimizer"></a>

## Optimizer
this class is the starting point of the library.
user will only interact with this class. here we generate different kind of reports using optimizers, apply changes and return the results to the user.

**Kind**: global class  
**Access**: public  

* [Optimizer](#Optimizer)
    * [.getReport()](#Optimizer+getReport) ⇒ <code>Report</code>
    * [.getOptimizedDocument([Options])](#Optimizer+getOptimizedDocument) ⇒ <code>string</code>

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
| [Options] | <code>Options</code> | the options are a way to customize the final output. |

