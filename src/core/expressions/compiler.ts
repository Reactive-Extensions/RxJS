class Expression {
    nodeType: ExpressionType;

    constructor(nodeType: ExpressionType) {
        this.nodeType = nodeType;
    }

    accept(visitor: ExpressionVisitor): Expression {
        throw new Error("not implemented");
    }

    acceptGeneric<T>(visitor: ExpressionVisitorGeneric<T>): T {
        throw new Error("not implemented");
    }

    toString(): string {
        return new PrintVisitor().visit(this);
    }

    toBonsai(): string {
        return new BonsaiVisitor().visit(this);
    }

    static constant(value: any): ConstantExpression {
        return new ConstantExpression(value);
    }

    static parameter(name: string): ParameterExpression {
        return new ParameterExpression(name);
    }

    static condition(test: Expression, ifTrue: Expression, ifFalse: Expression): ConditionalExpression {
        return new ConditionalExpression(test, ifTrue, ifFalse);
    }

    static add(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.Add, left, right);
    }

    static subtract(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.Subtract, left, right);
    }

    static multiply(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.Multiply, left, right);
    }

    static divide(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.Divide, left, right);
    }

    static modulo(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.Modulo, left, right);
    }

    static and(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.And, left, right);
    }

    static andAlso(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.AndAlso, left, right);
    }

    static or(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.Or, left, right);
    }

    static orElse(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.OrElse, left, right);
    }

    static exclusiveOr(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.ExclusiveOr, left, right);
    }

    static equal(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.Equal, left, right);
    }

    static notEqual(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.NotEqual, left, right);
    }

    static lessThan(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.LessThan, left, right);
    }

    static lessThanOrEqual(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.LessThanOrEqual, left, right);
    }

    static greaterThan(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.GreaterThan, left, right);
    }

    static greaterThanOrEqual(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.GreaterThanOrEqual, left, right);
    }

    static leftShift(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.LeftShift, left, right);
    }

    static rightShift(left: Expression, right: Expression): BinaryExpression {
        return new BinaryExpression(ExpressionType.RightShift, left, right);
    }

    static not(operand: Expression): UnaryExpression {
        return new UnaryExpression(ExpressionType.Not, operand);
    }

    static unaryPlus(operand: Expression): UnaryExpression {
        return new UnaryExpression(ExpressionType.UnaryPlus, operand);
    }

    static negate(operand: Expression): UnaryExpression {
        return new UnaryExpression(ExpressionType.Negate, operand);
    }

    static onesComplement(operand: Expression): UnaryExpression {
        return new UnaryExpression(ExpressionType.OnesComplement, operand);
    }

    static lambda<T extends Function>(body: Expression, ...parameters: ParameterExpression[]): LambdaExpression<T> {
        return new LambdaExpression<T>(body, parameters);
    }

    static invoke(expression: Expression, ...args: Expression[]): InvocationExpression {
        return new InvocationExpression(expression, args);
    }

    static new(typeName: string, ...args: Expression[]): NewExpression {
        return new NewExpression(typeName, args);
    }

    static functionCall(obj: Expression, methodName: string, ...args: Expression[]): FunctionCallExpression {
        return new FunctionCallExpression(obj, methodName, args);
    }

    static member(obj: Expression, memberName: string): MemberExpression {
        return new MemberExpression(obj, memberName);
    }

    static index(obj: Expression, ...args: Expression[]): IndexExpression {
        return new IndexExpression(obj, args);
    }
}

class ExpressionVisitorGeneric<T> {
    visit(node: Expression): T {
        if (node === null) {
            return null;
        }
        return node.acceptGeneric(this);
    }

    visitConstant(node: ConstantExpression): T { throw new Error("not implemented"); }

    visitParameter(node: ParameterExpression): T { throw new Error("not implemented"); }

    visitBinary(node: BinaryExpression): T { throw new Error("not implemented"); }

    visitUnary(node: UnaryExpression): T { throw new Error("not implemented"); }

    visitConditional(node: ConditionalExpression): T { throw new Error("not implemented"); }

    visitLambda<TFunction extends Function>(node: LambdaExpression<TFunction>): T { throw new Error("not implemented"); }

    visitInvoke(node: InvocationExpression): T { throw new Error("not implemented"); }

    visitCall(node: FunctionCallExpression): T { throw new Error("not implemented"); }

    visitNew(node: NewExpression): T { throw new Error("not implemented"); }

    visitMember(node: MemberExpression): T { throw new Error("not implemented"); }

    visitIndex(node: IndexExpression): T { throw new Error("not implemented"); }

    visitMany<E extends Expression>(nodes: E[]): T[] {
        var res = new Array<T>(nodes.length);

        for (var i = 0; i < nodes.length; i++) {
            var oldNode = nodes[i];
            var newNode = <T>this.visit(oldNode);
            res[i] = newNode;
        }

        return res;
    }
}

class ExpressionVisitor {
    visit(node: Expression): Expression {
        if (node === null) {
            return null;
        }
        return node.accept(this);
    }

    visitConstant(node: ConstantExpression): Expression {
        return node;
    }

    visitParameter(node: ParameterExpression): Expression {
        return node;
    }

    visitBinary(node: BinaryExpression): Expression {
        return node.update(this.visit(node.left), this.visit(node.right));
    }

    visitUnary(node: UnaryExpression): Expression {
        return node.update(this.visit(node.operand));
    }

    visitConditional(node: ConditionalExpression): Expression {
        return node.update(this.visit(node.test), this.visit(node.ifTrue), this.visit(node.ifFalse));
    }

    visitLambda<T extends Function>(node: LambdaExpression<T>): Expression {
        return node.update(this.visit(node.body), this.visitMany(node.parameters));
    }

    visitInvoke(node: InvocationExpression): Expression {
        return node.update(this.visit(node.expression), this.visitMany(node.args));
    }

    visitCall(node: FunctionCallExpression): Expression {
        return node.update(this.visit(node.obj), this.visitMany(node.args));
    }

    visitNew(node: NewExpression): Expression {
        return node.update(this.visitMany(node.args));
    }

    visitMember(node: MemberExpression): Expression {
        return node.update(this.visit(node.obj));
    }

    visitIndex(node: IndexExpression): Expression {
        return node.update(this.visit(node.obj), this.visitMany(node.args));
    }

    visitMany<T extends Expression>(nodes: T[]): T[] {
        var res = new Array<T>(nodes.length);

        for (var i = 0; i < nodes.length; i++) {
            var oldNode = nodes[i];
            var newNode = <T>this.visit(oldNode);
            res[i] = newNode;
        }

        return res;
    }
}

class ConstantExpression extends Expression {
    _value: any;

    constructor(value: any) {
        super(ExpressionType.Constant);
        this._value = value;
    }

    get value(): any {
        return this._value;
    }

    accept(visitor: ExpressionVisitor): Expression {
        return visitor.visitConstant(this);
    }

    acceptGeneric<T>(visitor: ExpressionVisitorGeneric<T>): T {
        return visitor.visitConstant(this);
    }
}

class ParameterExpression extends Expression {
    _name: string;

    constructor(name: string) {
        super(ExpressionType.Parameter);
        this._name = name;
    }

    get name(): string {
        return this._name;
    }

    accept(visitor: ExpressionVisitor): Expression {
        return visitor.visitParameter(this);
    }

    acceptGeneric<T>(visitor: ExpressionVisitorGeneric<T>): T {
        return visitor.visitParameter(this);
    }
}

class UnaryExpression extends Expression {
    _operand: Expression;

    constructor(nodeType: ExpressionType, operand: Expression) {
        super(nodeType);
        this._operand = operand;
    }

    get operand(): Expression {
        return this._operand;
    }

    accept(visitor: ExpressionVisitor): Expression {
        return visitor.visitUnary(this);
    }

    acceptGeneric<T>(visitor: ExpressionVisitorGeneric<T>): T {
        return visitor.visitUnary(this);
    }

    update(operand: Expression): UnaryExpression {
        if (operand !== this._operand) {
            return new UnaryExpression(this.nodeType, operand);
        }

        return this;
    }
}

class BinaryExpression extends Expression {
    _left: Expression;
    _right: Expression;

    constructor(nodeType: ExpressionType, left: Expression, right: Expression) {
        super(nodeType);
        this._left = left;
        this._right = right;
    }

    get left(): Expression {
        return this._left;
    }

    get right(): Expression {
        return this._right;
    }

    accept(visitor: ExpressionVisitor): Expression {
        return visitor.visitBinary(this);
    }

    acceptGeneric<T>(visitor: ExpressionVisitorGeneric<T>): T {
        return visitor.visitBinary(this);
    }

    update(left: Expression, right: Expression): BinaryExpression {
        if (left !== this._left || right !== this._right) {
            return new BinaryExpression(this.nodeType, left, right);
        }

        return this;
    }
}

class ConditionalExpression extends Expression {
    _test: Expression;
    _ifTrue: Expression;
    _ifFalse: Expression;

    constructor(test: Expression, ifTrue: Expression, ifFalse: Expression) {
        super(ExpressionType.Condition);
        this._test = test;
        this._ifTrue = ifTrue;
        this._ifFalse = ifFalse;
    }

    get test(): Expression {
        return this._test;
    }

    get ifTrue(): Expression {
        return this._ifTrue;
    }

    get ifFalse(): Expression {
        return this._ifTrue;
    }

    accept(visitor: ExpressionVisitor): Expression {
        return visitor.visitConditional(this);
    }

    acceptGeneric<T>(visitor: ExpressionVisitorGeneric<T>): T {
        return visitor.visitConditional(this);
    }

    update(test: Expression, ifTrue: Expression, ifFalse: Expression): ConditionalExpression {
        if (test !== this._test || ifTrue !== this._ifTrue || ifFalse !== this._ifFalse) {
            return new ConditionalExpression(test, ifTrue, ifFalse);
        }

        return this;
    }
}

class LambdaExpression<TFunction extends Function> extends Expression {
    _body: Expression;
    _parameters: ParameterExpression[];

    constructor(body: Expression, parameters: ParameterExpression[]) {
        super(ExpressionType.Lambda);
        this._body = body;
        this._parameters = parameters;
    }

    get body(): Expression {
        return this._body;
    }

    get parameters(): ParameterExpression[] {
        return this._parameters;
    }

    accept(visitor: ExpressionVisitor): Expression {
        return visitor.visitLambda<TFunction>(this);
    }

    acceptGeneric<T>(visitor: ExpressionVisitorGeneric<T>): T {
        return visitor.visitLambda<TFunction>(this);
    }

    update(body: Expression, parameters: ParameterExpression[]): LambdaExpression<TFunction> {
        if (body !== this._body || parameters !== this._parameters) {
            return new LambdaExpression<TFunction>(body, parameters);
        }

        return this;
    }

    compileToFunction(debug?: boolean): string {
        var comp = new LambdaCompiler();
        comp.visit(this);

        var code = comp.code;

        code = code.replace(/"/g, "\\\""); // TODO: more escape sequences
        code = "new Function(\"return " + code + ";\")";
        code = code.replace(/\r?\n|\r/g, "");

        if (debug) {
            alert(code);
        }

        return code;
    }

    compile(debug?: boolean): TFunction {
        var code = this.compileToFunction(debug);
        return <TFunction>eval(code)();
    }
}

class InvocationExpression extends Expression {
    _expression: Expression;
    _args: Expression[];

    constructor(expression: Expression, args: Expression[]) {
        super(ExpressionType.Invoke);
        this._expression = expression;
        this._args = args;
    }

    get expression(): Expression {
        return this._expression;
    }

    get args(): Expression[] {
        return this._args;
    }

    accept(visitor: ExpressionVisitor): Expression {
        return visitor.visitInvoke(this);
    }

    acceptGeneric<T>(visitor: ExpressionVisitorGeneric<T>): T {
        return visitor.visitInvoke(this);
    }

    update(expression: Expression, args: Expression[]): InvocationExpression {
        if (expression !== this._expression || args !== this._args) {
            return new InvocationExpression(expression, args);
        }

        return this;
    }
}

class FunctionCallExpression extends Expression {
    _expression: Expression;
    _method: string;
    _args: Expression[];

    constructor(expression: Expression, methodName: string, args: Expression[]) {
        super(ExpressionType.Call);
        this._expression = expression;
        this._method = methodName;
        this._args = args;
    }

    get obj(): Expression {
        return this._expression;
    }

    get method(): string {
        return this._method;
    }

    get args(): Expression[] {
        return this._args;
    }

    accept(visitor: ExpressionVisitor): Expression {
        return visitor.visitCall(this);
    }

    acceptGeneric<T>(visitor: ExpressionVisitorGeneric<T>): T {
        return visitor.visitCall(this);
    }

    update(expression: Expression, args: Expression[]): FunctionCallExpression {
        if (expression !== this._expression || args !== this._args) {
            return new FunctionCallExpression(expression, this._method, args);
        }

        return this;
    }
}

class IndexExpression extends Expression {
    _expression: Expression;
    _args: Expression[];

    constructor(expression: Expression, args: Expression[]) {
        super(ExpressionType.Index);
        this._expression = expression;
        this._args = args;
    }

    get obj(): Expression {
        return this._expression;
    }

    get args(): Expression[] {
        return this._args;
    }

    accept(visitor: ExpressionVisitor): Expression {
        return visitor.visitIndex(this);
    }

    acceptGeneric<T>(visitor: ExpressionVisitorGeneric<T>): T {
        return visitor.visitIndex(this);
    }

    update(expression: Expression, args: Expression[]): IndexExpression {
        if (expression !== this._expression || args !== this._args) {
            return new IndexExpression(expression, args);
        }

        return this;
    }
}

class NewExpression extends Expression {
    _type: string;
    _args: Expression[];

    constructor(typeName: string, args: Expression[]) {
        super(ExpressionType.New);
        this._type = typeName;
        this._args = args;
    }

    get type(): string {
        return this._type;
    }

    get args(): Expression[] {
        return this._args;
    }

    accept(visitor: ExpressionVisitor): Expression {
        return visitor.visitNew(this);
    }

    acceptGeneric<T>(visitor: ExpressionVisitorGeneric<T>): T {
        return visitor.visitNew(this);
    }

    update(args: Expression[]): NewExpression {
        if (args !== this._args) {
            return new NewExpression(this._type, args);
        }

        return this;
    }
}

class MemberExpression extends Expression {
    _obj: Expression;
    _member: string;

    constructor(obj: Expression, memberName: string) {
        super(ExpressionType.Member);
        this._obj = obj;
        this._member = memberName;
    }

    get obj(): Expression {
        return this._obj;
    }

    get member(): string {
        return this._member;
    }

    accept(visitor: ExpressionVisitor): Expression {
        return visitor.visitMember(this);
    }

    acceptGeneric<T>(visitor: ExpressionVisitorGeneric<T>): T {
        return visitor.visitMember(this);
    }

    update(obj: Expression): MemberExpression {
        if (obj !== this._obj) {
            return new MemberExpression(obj, this._member);
        }

        return this;
    }
}

class LambdaCompiler extends ExpressionVisitor {
    _stack: string[];

    constructor() {
        super();
        this._stack = [];
    }

    get code(): string {
        if (this._stack.length != 1)
            throw new Error("invalid code generation");

        return this._stack[0];
    }

    visitConstant(node: ConstantExpression): Expression {
        var value = "";

        if (typeof node.value == "string") {
            value = "\"" + node.value + "\""; // TODO: escape characters
        }
        else if (node.value instanceof Array) {
            value = JSON.stringify(node.value);
        }
        else if (node.value === undefined) {
            value = "undefined";
        }
        else {
            value = node.value.toString(); // TODO
        }

        this._stack.push(value);

        return node;
    }

    visitUnary(node: UnaryExpression): Expression {
        this.visit(node.operand);

        var o = this._stack.pop();
        var i = "";

        switch (node.nodeType) {
            case ExpressionType.Negate:
                i = "-";
                break;
            case ExpressionType.UnaryPlus:
                i = "+";
                break;
            case ExpressionType.Not:
                i = "!";
                break;
            case ExpressionType.OnesComplement:
                i = "~";
                break;
        }

        var res = "(" + i + "" + o + ")";
        this._stack.push(res);

        return node;
    }

    visitBinary(node: BinaryExpression): Expression {
        this.visit(node.left);
        this.visit(node.right);

        var r = this._stack.pop();
        var l = this._stack.pop();
        var i = "";

        switch (node.nodeType) {
            case ExpressionType.Add:
                i = "+";
                break;
            case ExpressionType.Subtract:
                i = "-";
                break;
            case ExpressionType.Multiply:
                i = "*";
                break;
            case ExpressionType.Divide:
                i = "/";
                break;
            case ExpressionType.Modulo:
                i = "%";
                break;
            case ExpressionType.And:
                i = "&";
                break;
            case ExpressionType.Or:
                i = "|";
                break;
            case ExpressionType.AndAlso:
                i = "&&";
                break;
            case ExpressionType.OrElse:
                i = "||";
                break;
            case ExpressionType.ExclusiveOr:
                i = "^";
                break;
            case ExpressionType.Equal:
                i = "===";
                break;
            case ExpressionType.NotEqual:
                i = "!==";
                break;
            case ExpressionType.LessThan:
                i = "<";
                break;
            case ExpressionType.LessThanOrEqual:
                i = "<=";
                break;
            case ExpressionType.GreaterThan:
                i = ">";
                break;
            case ExpressionType.GreaterThanOrEqual:
                i = ">=";
                break;
            case ExpressionType.LeftShift:
                i = "<<";
                break;
            case ExpressionType.RightShift:
                i = ">>";
                break;
        }

        var res = "(" + l + " " + i + " " + r + ")";
        this._stack.push(res);

        return node;
    }

    visitConditional(node: ConditionalExpression): Expression {
        this.visit(node.test);
        this.visit(node.ifTrue);
        this.visit(node.ifFalse);

        var f = this._stack.pop();
        var t = this._stack.pop();
        var c = this._stack.pop();

        var res = "(" + c + " ? " + t + " : " + f + ")";

        this._stack.push(res);

        return node;
    }

    visitParameter(node: ParameterExpression): Expression {
        this._stack.push(node.name);

        return node;
    }

    visitLambda<T extends Function>(node: LambdaExpression<T>): Expression {
        this.visitMany(node.parameters);
        this.visit(node.body);

        var body = this._stack.pop();

        var n = node.parameters.length;
        var args = new Array<string>(n);
        for (var i = 0; i < n; i++) {
            args[n - i - 1] = this._stack.pop();
        }

        var allArgs = args.join(", ");

        var res = "function(" + allArgs + ") { return " + body + "; }";

        this._stack.push(res);

        return node;
    }

    visitInvoke(node: InvocationExpression): Expression {
        this.visit(node.expression);
        this.visitMany(node.args);

        var n = node.args.length;
        var args = new Array<string>(n);
        for (var i = 0; i < n; i++) {
            args[n - i - 1] = this._stack.pop();
        }

        var argList = args.join(", ");

        var func = this._stack.pop();

        var res = func + "(" + argList + ")";

        this._stack.push(res);

        return node;
    }

    visitCall(node: FunctionCallExpression): Expression {
        var res = "";

        if (node.obj !== null) {
            this.visit(node.obj);
            res = this._stack.pop() + ".";
        }

        this.visitMany(node.args);

        var n = node.args.length;
        var args = new Array<string>(n);
        for (var i = 0; i < n; i++) {
            args[n - i - 1] = this._stack.pop();
        }

        var argList = args.join(", ");

        res += node.method + "(" + argList + ")";

        this._stack.push(res);

        return node;
    }

    visitNew(node: NewExpression): Expression {
        this.visitMany(node.args);

        var n = node.args.length;
        var args = new Array<string>(n);
        for (var i = 0; i < n; i++) {
            args[n - i - 1] = this._stack.pop();
        }

        var argList = args.join(", ");

        var res = "new " + node.type + "(" + argList + ")";

        this._stack.push(res);

        return node;
    }

    visitMember(node: MemberExpression): Expression {
        var res = "";

        if (node.obj !== null) {
            this.visit(node.obj);
            res = this._stack.pop() + ".";
        }

        res += node.member;

        this._stack.push(res);

        return node;
    }

    visitIndex(node: IndexExpression): Expression {
        this.visit(node.obj);
        var res = this._stack.pop();

        this.visitMany(node.args);

        var n = node.args.length;
        var args = new Array<string>(n);
        for (var i = 0; i < n; i++) {
            args[n - i - 1] = this._stack.pop();
        }

        var argList = args.join(", ");

        res += "[" + argList + "]";

        this._stack.push(res);

        return node;
    }
}

class FreeVariableScanner extends ExpressionVisitor {
    _stack: Expression[][];
    _result: Expression[];

    constructor() {
        super();
        this._stack = [];
        this._result = [];
    }

    get result(): Expression[] {
        return this._result;
    }

    visitParameter(node: ParameterExpression): Expression {
        var found = false;

        for (var i = this._stack.length - 1; i >= 0; i--) {
            if (this._stack[i].indexOf(node) >= 0) {
                found = true;
                break;
            }
        }

        if (!found) {
            this._result.push(node);
        }

        return node;
    }

    visitLambda<T extends Function>(node: LambdaExpression<T>): Expression {
        this._stack.push(node.parameters);

        this.visit(node.body);

        this._stack.pop();

        return node;
    }
}

enum ExpressionType {
    Constant,
    Parameter,
    Lambda,
    Add,
    Subtract,
    Multiply,
    Divide,
    Modulo,
    And,
    Or,
    AndAlso,
    OrElse,
    ExclusiveOr,
    Equal,
    NotEqual,
    LessThan,
    LessThanOrEqual,
    GreaterThan,
    GreaterThanOrEqual,
    LeftShift,
    RightShift,
    Invoke,
    Not,
    Negate,
    UnaryPlus,
    OnesComplement,
    Condition,
    New,
    Call,
    Member,
    Index,
}

class Binder extends ExpressionVisitor {
    _stack: Expression[][];
    _resources: any;

    constructor(resources: any) {
        super();
        this._stack = [];
        this._resources = resources;
    }

    visitParameter(node: ParameterExpression): Expression {
        var found = false;

        for (var i = this._stack.length - 1; i >= 0; i--) {
            if (this._stack[i].indexOf(node) >= 0) {
                found = true;
                break;
            }
        }

        if (!found) {
            return Expression.constant(this._resources[node.name]);
        }

        return node;
    }

    visitLambda<T extends Function>(node: LambdaExpression<T>): Expression {
        this._stack.push(node.parameters);

        this.visit(node.body);

        this._stack.pop();

        return node;
    }
}

class PrintVisitor extends ExpressionVisitorGeneric<string> {
    visitConstant(node: ConstantExpression): string {
        return "Constant(" + node.value + ")";
    }

    visitParameter(node: ParameterExpression): string {
        return "Parameter(" + node.name + ")";
    }

    visitBinary(node: BinaryExpression): string {
        return ExpressionType[node.nodeType] + "(" + this.visit(node.left) + ", " + this.visit(node.right) + ")";
    }

    visitUnary(node: UnaryExpression): string {
        return ExpressionType[node.nodeType] + "(" + this.visit(node.operand) + ")";
    }

    visitConditional(node: ConditionalExpression): string {
        return "Conditional(" + this.visit(node.test) + ", " + this.visit(node.ifTrue) + ", " + this.visit(node.ifFalse) + ")";
    }

    visitLambda<T extends Function>(node: LambdaExpression<T>): string {
        var body = this.visit(node.body);
        var children = this.visitMany(node.parameters);
        children.unshift(body);
        return "Lambda(" + children.join(", ") + ")";
    }

    visitInvoke(node: InvocationExpression): string {
        var expression = this.visit(node.expression);
        var children = this.visitMany(node.args);
        children.unshift(expression);
        return "Invoke(" + children.join(", ") + ")";
    }

    visitCall(node: FunctionCallExpression): string {
        var children = this.visitMany(node.args);
        if (node.obj != null) {
            children.unshift(this.visit(node.obj));
        }
        children.unshift(node.method);
        return "Call(" + children.join(", ") + ")";
    }

    visitNew(node: NewExpression): string {
        var children = this.visitMany(node.args);
        children.unshift(node.type);
        return "New(" + children.join(", ") + ")";
    }

    visitMember(node: MemberExpression): string {
        var children = <string[]>[];
        if (node.obj != null) {
            children.unshift(this.visit(node.obj));
        }
        children.unshift(node.member);
        return "Member(" + children.join(", ") + ")";
    }

    visitIndex(node: IndexExpression): string {
        var children = this.visitMany(node.args);
        if (node.obj != null) {
            children.unshift(this.visit(node.obj));
        }
        return "Index(" + children.join(", ") + ")";
    }
}

class BonsaiVisitor extends ExpressionVisitorGeneric<any> {
    visitConstant(node: ConstantExpression): any {
        return [ ":", node.value ];
    }

    visitParameter(node: ParameterExpression): any {
        return ["$", node.name];
    }

    visitBinary(node: BinaryExpression): any {
        var i = "";

        switch (node.nodeType) {
            case ExpressionType.Add:
                i = "+";
                break;
            case ExpressionType.Subtract:
                i = "-";
                break;
            case ExpressionType.Multiply:
                i = "*";
                break;
            case ExpressionType.Divide:
                i = "/";
                break;
            case ExpressionType.Modulo:
                i = "%";
                break;
            case ExpressionType.And:
                i = "&";
                break;
            case ExpressionType.Or:
                i = "|";
                break;
            case ExpressionType.AndAlso:
                i = "&&";
                break;
            case ExpressionType.OrElse:
                i = "||";
                break;
            case ExpressionType.ExclusiveOr:
                i = "^";
                break;
            case ExpressionType.Equal:
                i = "===";
                break;
            case ExpressionType.NotEqual:
                i = "!==";
                break;
            case ExpressionType.LessThan:
                i = "<";
                break;
            case ExpressionType.LessThanOrEqual:
                i = "<=";
                break;
            case ExpressionType.GreaterThan:
                i = ">";
                break;
            case ExpressionType.GreaterThanOrEqual:
                i = ">=";
                break;
            case ExpressionType.LeftShift:
                i = "<<";
                break;
            case ExpressionType.RightShift:
                i = ">>";
                break;
        }

        return [ i, this.visit(node.left), this.visit(node.right) ];
    }

    visitUnary(node: UnaryExpression): any {
        var i = "";

        switch (node.nodeType) {
            case ExpressionType.Negate:
                i = "-";
                break;
            case ExpressionType.UnaryPlus:
                i = "+";
                break;
            case ExpressionType.Not:
                i = "!";
                break;
            case ExpressionType.OnesComplement:
                i = "~";
                break;
        }

        return [i, this.visit(node.operand)];
    }

    visitConditional(node: ConditionalExpression): any {
        return ["?:", this.visit(node.test), this.visit(node.ifTrue), this.visit(node.ifFalse) ];
    }

    visitLambda<T extends Function>(node: LambdaExpression<T>): any {
        return ["=>", this.visit(node.body), this.visitMany(node.parameters)];
    }

    visitInvoke(node: InvocationExpression): any {
        var expression = this.visit(node.expression);
        var args = this.visitMany(node.args);
        return ["()", expression, args];
    }

    visitCall(node: FunctionCallExpression): any {
        var args = <any[]>[];
        if (node.obj != null) {
            args.unshift(this.visit(node.obj));
        }
        args.unshift(this.visitMany(node.args));
        return [".()", node.method, args];
    }

    visitNew(node: NewExpression): any {
        var args = this.visitMany(node.args);
        return ["new", args];
    }

    visitMember(node: MemberExpression): any {
        var res = [".", node.member];
        if (node.obj != null) {
            res.unshift(this.visit(node.obj));
        }
        return res;
    }

    visitIndex(node: IndexExpression): any {
        throw new Error("not implemented");
    }
}