var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Expression = (function () {
    function Expression(nodeType) {
        this.nodeType = nodeType;
    }
    Expression.prototype.accept = function (visitor) {
        throw new Error("not implemented");
    };
    Expression.prototype.acceptGeneric = function (visitor) {
        throw new Error("not implemented");
    };
    Expression.prototype.toString = function () {
        return new PrintVisitor().visit(this);
    };
    Expression.prototype.toBonsai = function () {
        return new BonsaiVisitor().visit(this);
    };
    Expression.constant = function (value) {
        return new ConstantExpression(value);
    };
    Expression.parameter = function (name) {
        return new ParameterExpression(name);
    };
    Expression.condition = function (test, ifTrue, ifFalse) {
        return new ConditionalExpression(test, ifTrue, ifFalse);
    };
    Expression.add = function (left, right) {
        return new BinaryExpression(3 /* Add */, left, right);
    };
    Expression.subtract = function (left, right) {
        return new BinaryExpression(4 /* Subtract */, left, right);
    };
    Expression.multiply = function (left, right) {
        return new BinaryExpression(5 /* Multiply */, left, right);
    };
    Expression.divide = function (left, right) {
        return new BinaryExpression(6 /* Divide */, left, right);
    };
    Expression.modulo = function (left, right) {
        return new BinaryExpression(7 /* Modulo */, left, right);
    };
    Expression.and = function (left, right) {
        return new BinaryExpression(8 /* And */, left, right);
    };
    Expression.andAlso = function (left, right) {
        return new BinaryExpression(10 /* AndAlso */, left, right);
    };
    Expression.or = function (left, right) {
        return new BinaryExpression(9 /* Or */, left, right);
    };
    Expression.orElse = function (left, right) {
        return new BinaryExpression(11 /* OrElse */, left, right);
    };
    Expression.exclusiveOr = function (left, right) {
        return new BinaryExpression(12 /* ExclusiveOr */, left, right);
    };
    Expression.equal = function (left, right) {
        return new BinaryExpression(13 /* Equal */, left, right);
    };
    Expression.notEqual = function (left, right) {
        return new BinaryExpression(14 /* NotEqual */, left, right);
    };
    Expression.lessThan = function (left, right) {
        return new BinaryExpression(15 /* LessThan */, left, right);
    };
    Expression.lessThanOrEqual = function (left, right) {
        return new BinaryExpression(16 /* LessThanOrEqual */, left, right);
    };
    Expression.greaterThan = function (left, right) {
        return new BinaryExpression(17 /* GreaterThan */, left, right);
    };
    Expression.greaterThanOrEqual = function (left, right) {
        return new BinaryExpression(18 /* GreaterThanOrEqual */, left, right);
    };
    Expression.leftShift = function (left, right) {
        return new BinaryExpression(19 /* LeftShift */, left, right);
    };
    Expression.rightShift = function (left, right) {
        return new BinaryExpression(20 /* RightShift */, left, right);
    };
    Expression.not = function (operand) {
        return new UnaryExpression(22 /* Not */, operand);
    };
    Expression.unaryPlus = function (operand) {
        return new UnaryExpression(24 /* UnaryPlus */, operand);
    };
    Expression.negate = function (operand) {
        return new UnaryExpression(23 /* Negate */, operand);
    };
    Expression.onesComplement = function (operand) {
        return new UnaryExpression(25 /* OnesComplement */, operand);
    };
    Expression.lambda = function (body) {
        var parameters = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            parameters[_i - 1] = arguments[_i];
        }
        return new LambdaExpression(body, parameters);
    };
    Expression.invoke = function (expression) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new InvocationExpression(expression, args);
    };
    Expression.new = function (typeName) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new NewExpression(typeName, args);
    };
    Expression.functionCall = function (obj, methodName) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        return new FunctionCallExpression(obj, methodName, args);
    };
    Expression.member = function (obj, memberName) {
        return new MemberExpression(obj, memberName);
    };
    Expression.index = function (obj) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new IndexExpression(obj, args);
    };
    return Expression;
})();
var ExpressionVisitorGeneric = (function () {
    function ExpressionVisitorGeneric() {
    }
    ExpressionVisitorGeneric.prototype.visit = function (node) {
        if (node === null) {
            return null;
        }
        return node.acceptGeneric(this);
    };
    ExpressionVisitorGeneric.prototype.visitConstant = function (node) {
        throw new Error("not implemented");
    };
    ExpressionVisitorGeneric.prototype.visitParameter = function (node) {
        throw new Error("not implemented");
    };
    ExpressionVisitorGeneric.prototype.visitBinary = function (node) {
        throw new Error("not implemented");
    };
    ExpressionVisitorGeneric.prototype.visitUnary = function (node) {
        throw new Error("not implemented");
    };
    ExpressionVisitorGeneric.prototype.visitConditional = function (node) {
        throw new Error("not implemented");
    };
    ExpressionVisitorGeneric.prototype.visitLambda = function (node) {
        throw new Error("not implemented");
    };
    ExpressionVisitorGeneric.prototype.visitInvoke = function (node) {
        throw new Error("not implemented");
    };
    ExpressionVisitorGeneric.prototype.visitCall = function (node) {
        throw new Error("not implemented");
    };
    ExpressionVisitorGeneric.prototype.visitNew = function (node) {
        throw new Error("not implemented");
    };
    ExpressionVisitorGeneric.prototype.visitMember = function (node) {
        throw new Error("not implemented");
    };
    ExpressionVisitorGeneric.prototype.visitIndex = function (node) {
        throw new Error("not implemented");
    };
    ExpressionVisitorGeneric.prototype.visitMany = function (nodes) {
        var res = new Array(nodes.length);
        for (var i = 0; i < nodes.length; i++) {
            var oldNode = nodes[i];
            var newNode = this.visit(oldNode);
            res[i] = newNode;
        }
        return res;
    };
    return ExpressionVisitorGeneric;
})();
var ExpressionVisitor = (function () {
    function ExpressionVisitor() {
    }
    ExpressionVisitor.prototype.visit = function (node) {
        if (node === null) {
            return null;
        }
        return node.accept(this);
    };
    ExpressionVisitor.prototype.visitConstant = function (node) {
        return node;
    };
    ExpressionVisitor.prototype.visitParameter = function (node) {
        return node;
    };
    ExpressionVisitor.prototype.visitBinary = function (node) {
        return node.update(this.visit(node.left), this.visit(node.right));
    };
    ExpressionVisitor.prototype.visitUnary = function (node) {
        return node.update(this.visit(node.operand));
    };
    ExpressionVisitor.prototype.visitConditional = function (node) {
        return node.update(this.visit(node.test), this.visit(node.ifTrue), this.visit(node.ifFalse));
    };
    ExpressionVisitor.prototype.visitLambda = function (node) {
        return node.update(this.visit(node.body), this.visitMany(node.parameters));
    };
    ExpressionVisitor.prototype.visitInvoke = function (node) {
        return node.update(this.visit(node.expression), this.visitMany(node.args));
    };
    ExpressionVisitor.prototype.visitCall = function (node) {
        return node.update(this.visit(node.obj), this.visitMany(node.args));
    };
    ExpressionVisitor.prototype.visitNew = function (node) {
        return node.update(this.visitMany(node.args));
    };
    ExpressionVisitor.prototype.visitMember = function (node) {
        return node.update(this.visit(node.obj));
    };
    ExpressionVisitor.prototype.visitIndex = function (node) {
        return node.update(this.visit(node.obj), this.visitMany(node.args));
    };
    ExpressionVisitor.prototype.visitMany = function (nodes) {
        var res = new Array(nodes.length);
        for (var i = 0; i < nodes.length; i++) {
            var oldNode = nodes[i];
            var newNode = this.visit(oldNode);
            res[i] = newNode;
        }
        return res;
    };
    return ExpressionVisitor;
})();
var ConstantExpression = (function (_super) {
    __extends(ConstantExpression, _super);
    function ConstantExpression(value) {
        _super.call(this, 0 /* Constant */);
        this._value = value;
    }
    Object.defineProperty(ConstantExpression.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    ConstantExpression.prototype.accept = function (visitor) {
        return visitor.visitConstant(this);
    };
    ConstantExpression.prototype.acceptGeneric = function (visitor) {
        return visitor.visitConstant(this);
    };
    return ConstantExpression;
})(Expression);
var ParameterExpression = (function (_super) {
    __extends(ParameterExpression, _super);
    function ParameterExpression(name) {
        _super.call(this, 1 /* Parameter */);
        this._name = name;
    }
    Object.defineProperty(ParameterExpression.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: true,
        configurable: true
    });
    ParameterExpression.prototype.accept = function (visitor) {
        return visitor.visitParameter(this);
    };
    ParameterExpression.prototype.acceptGeneric = function (visitor) {
        return visitor.visitParameter(this);
    };
    return ParameterExpression;
})(Expression);
var UnaryExpression = (function (_super) {
    __extends(UnaryExpression, _super);
    function UnaryExpression(nodeType, operand) {
        _super.call(this, nodeType);
        this._operand = operand;
    }
    Object.defineProperty(UnaryExpression.prototype, "operand", {
        get: function () {
            return this._operand;
        },
        enumerable: true,
        configurable: true
    });
    UnaryExpression.prototype.accept = function (visitor) {
        return visitor.visitUnary(this);
    };
    UnaryExpression.prototype.acceptGeneric = function (visitor) {
        return visitor.visitUnary(this);
    };
    UnaryExpression.prototype.update = function (operand) {
        if (operand !== this._operand) {
            return new UnaryExpression(this.nodeType, operand);
        }
        return this;
    };
    return UnaryExpression;
})(Expression);
var BinaryExpression = (function (_super) {
    __extends(BinaryExpression, _super);
    function BinaryExpression(nodeType, left, right) {
        _super.call(this, nodeType);
        this._left = left;
        this._right = right;
    }
    Object.defineProperty(BinaryExpression.prototype, "left", {
        get: function () {
            return this._left;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BinaryExpression.prototype, "right", {
        get: function () {
            return this._right;
        },
        enumerable: true,
        configurable: true
    });
    BinaryExpression.prototype.accept = function (visitor) {
        return visitor.visitBinary(this);
    };
    BinaryExpression.prototype.acceptGeneric = function (visitor) {
        return visitor.visitBinary(this);
    };
    BinaryExpression.prototype.update = function (left, right) {
        if (left !== this._left || right !== this._right) {
            return new BinaryExpression(this.nodeType, left, right);
        }
        return this;
    };
    return BinaryExpression;
})(Expression);
var ConditionalExpression = (function (_super) {
    __extends(ConditionalExpression, _super);
    function ConditionalExpression(test, ifTrue, ifFalse) {
        _super.call(this, 26 /* Condition */);
        this._test = test;
        this._ifTrue = ifTrue;
        this._ifFalse = ifFalse;
    }
    Object.defineProperty(ConditionalExpression.prototype, "test", {
        get: function () {
            return this._test;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionalExpression.prototype, "ifTrue", {
        get: function () {
            return this._ifTrue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConditionalExpression.prototype, "ifFalse", {
        get: function () {
            return this._ifTrue;
        },
        enumerable: true,
        configurable: true
    });
    ConditionalExpression.prototype.accept = function (visitor) {
        return visitor.visitConditional(this);
    };
    ConditionalExpression.prototype.acceptGeneric = function (visitor) {
        return visitor.visitConditional(this);
    };
    ConditionalExpression.prototype.update = function (test, ifTrue, ifFalse) {
        if (test !== this._test || ifTrue !== this._ifTrue || ifFalse !== this._ifFalse) {
            return new ConditionalExpression(test, ifTrue, ifFalse);
        }
        return this;
    };
    return ConditionalExpression;
})(Expression);
var LambdaExpression = (function (_super) {
    __extends(LambdaExpression, _super);
    function LambdaExpression(body, parameters) {
        _super.call(this, 2 /* Lambda */);
        this._body = body;
        this._parameters = parameters;
    }
    Object.defineProperty(LambdaExpression.prototype, "body", {
        get: function () {
            return this._body;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LambdaExpression.prototype, "parameters", {
        get: function () {
            return this._parameters;
        },
        enumerable: true,
        configurable: true
    });
    LambdaExpression.prototype.accept = function (visitor) {
        return visitor.visitLambda(this);
    };
    LambdaExpression.prototype.acceptGeneric = function (visitor) {
        return visitor.visitLambda(this);
    };
    LambdaExpression.prototype.update = function (body, parameters) {
        if (body !== this._body || parameters !== this._parameters) {
            return new LambdaExpression(body, parameters);
        }
        return this;
    };
    LambdaExpression.prototype.compileToFunction = function (debug) {
        var comp = new LambdaCompiler();
        comp.visit(this);
        var code = comp.code;
        code = code.replace(/\"/g, "\\\""); // TODO: more escape sequences
        code = "new Function(\"return " + code + ";\")";
        code = code.replace(/\r?\n|\r/g, "");
        if (debug) {
            alert(code);
        }
        return code;
    };
    LambdaExpression.prototype.compile = function (debug) {
        var code = this.compileToFunction(debug);
        return eval(code)();
    };
    return LambdaExpression;
})(Expression);
var InvocationExpression = (function (_super) {
    __extends(InvocationExpression, _super);
    function InvocationExpression(expression, args) {
        _super.call(this, 21 /* Invoke */);
        this._expression = expression;
        this._args = args;
    }
    Object.defineProperty(InvocationExpression.prototype, "expression", {
        get: function () {
            return this._expression;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InvocationExpression.prototype, "args", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
    InvocationExpression.prototype.accept = function (visitor) {
        return visitor.visitInvoke(this);
    };
    InvocationExpression.prototype.acceptGeneric = function (visitor) {
        return visitor.visitInvoke(this);
    };
    InvocationExpression.prototype.update = function (expression, args) {
        if (expression !== this._expression || args !== this._args) {
            return new InvocationExpression(expression, args);
        }
        return this;
    };
    return InvocationExpression;
})(Expression);
var FunctionCallExpression = (function (_super) {
    __extends(FunctionCallExpression, _super);
    function FunctionCallExpression(expression, methodName, args) {
        _super.call(this, 28 /* Call */);
        this._expression = expression;
        this._method = methodName;
        this._args = args;
    }
    Object.defineProperty(FunctionCallExpression.prototype, "obj", {
        get: function () {
            return this._expression;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FunctionCallExpression.prototype, "method", {
        get: function () {
            return this._method;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FunctionCallExpression.prototype, "args", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
    FunctionCallExpression.prototype.accept = function (visitor) {
        return visitor.visitCall(this);
    };
    FunctionCallExpression.prototype.acceptGeneric = function (visitor) {
        return visitor.visitCall(this);
    };
    FunctionCallExpression.prototype.update = function (expression, args) {
        if (expression !== this._expression || args !== this._args) {
            return new FunctionCallExpression(expression, this._method, args);
        }
        return this;
    };
    return FunctionCallExpression;
})(Expression);
var IndexExpression = (function (_super) {
    __extends(IndexExpression, _super);
    function IndexExpression(expression, args) {
        _super.call(this, 30 /* Index */);
        this._expression = expression;
        this._args = args;
    }
    Object.defineProperty(IndexExpression.prototype, "obj", {
        get: function () {
            return this._expression;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IndexExpression.prototype, "args", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
    IndexExpression.prototype.accept = function (visitor) {
        return visitor.visitIndex(this);
    };
    IndexExpression.prototype.acceptGeneric = function (visitor) {
        return visitor.visitIndex(this);
    };
    IndexExpression.prototype.update = function (expression, args) {
        if (expression !== this._expression || args !== this._args) {
            return new IndexExpression(expression, args);
        }
        return this;
    };
    return IndexExpression;
})(Expression);
var NewExpression = (function (_super) {
    __extends(NewExpression, _super);
    function NewExpression(typeName, args) {
        _super.call(this, 27 /* New */);
        this._type = typeName;
        this._args = args;
    }
    Object.defineProperty(NewExpression.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NewExpression.prototype, "args", {
        get: function () {
            return this._args;
        },
        enumerable: true,
        configurable: true
    });
    NewExpression.prototype.accept = function (visitor) {
        return visitor.visitNew(this);
    };
    NewExpression.prototype.acceptGeneric = function (visitor) {
        return visitor.visitNew(this);
    };
    NewExpression.prototype.update = function (args) {
        if (args !== this._args) {
            return new NewExpression(this._type, args);
        }
        return this;
    };
    return NewExpression;
})(Expression);
var MemberExpression = (function (_super) {
    __extends(MemberExpression, _super);
    function MemberExpression(obj, memberName) {
        _super.call(this, 29 /* Member */);
        this._obj = obj;
        this._member = memberName;
    }
    Object.defineProperty(MemberExpression.prototype, "obj", {
        get: function () {
            return this._obj;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MemberExpression.prototype, "member", {
        get: function () {
            return this._member;
        },
        enumerable: true,
        configurable: true
    });
    MemberExpression.prototype.accept = function (visitor) {
        return visitor.visitMember(this);
    };
    MemberExpression.prototype.acceptGeneric = function (visitor) {
        return visitor.visitMember(this);
    };
    MemberExpression.prototype.update = function (obj) {
        if (obj !== this._obj) {
            return new MemberExpression(obj, this._member);
        }
        return this;
    };
    return MemberExpression;
})(Expression);
var LambdaCompiler = (function (_super) {
    __extends(LambdaCompiler, _super);
    function LambdaCompiler() {
        _super.call(this);
        this._stack = new Array();
    }
    Object.defineProperty(LambdaCompiler.prototype, "code", {
        get: function () {
            if (this._stack.length != 1)
                throw new Error("invalid code generation");
            return this._stack[0];
        },
        enumerable: true,
        configurable: true
    });
    LambdaCompiler.prototype.visitConstant = function (node) {
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
    };
    LambdaCompiler.prototype.visitUnary = function (node) {
        this.visit(node.operand);
        var o = this._stack.pop();
        var i = "";
        switch (node.nodeType) {
            case 23 /* Negate */:
                i = "-";
                break;
            case 24 /* UnaryPlus */:
                i = "+";
                break;
            case 22 /* Not */:
                i = "!";
                break;
            case 25 /* OnesComplement */:
                i = "~";
                break;
        }
        var res = "(" + i + "" + o + ")";
        this._stack.push(res);
        return node;
    };
    LambdaCompiler.prototype.visitBinary = function (node) {
        this.visit(node.left);
        this.visit(node.right);
        var r = this._stack.pop();
        var l = this._stack.pop();
        var i = "";
        switch (node.nodeType) {
            case 3 /* Add */:
                i = "+";
                break;
            case 4 /* Subtract */:
                i = "-";
                break;
            case 5 /* Multiply */:
                i = "*";
                break;
            case 6 /* Divide */:
                i = "/";
                break;
            case 7 /* Modulo */:
                i = "%";
                break;
            case 8 /* And */:
                i = "&";
                break;
            case 9 /* Or */:
                i = "|";
                break;
            case 10 /* AndAlso */:
                i = "&&";
                break;
            case 11 /* OrElse */:
                i = "||";
                break;
            case 12 /* ExclusiveOr */:
                i = "^";
                break;
            case 13 /* Equal */:
                i = "===";
                break;
            case 14 /* NotEqual */:
                i = "!==";
                break;
            case 15 /* LessThan */:
                i = "<";
                break;
            case 16 /* LessThanOrEqual */:
                i = "<=";
                break;
            case 17 /* GreaterThan */:
                i = ">";
                break;
            case 18 /* GreaterThanOrEqual */:
                i = ">=";
                break;
            case 19 /* LeftShift */:
                i = "<<";
                break;
            case 20 /* RightShift */:
                i = ">>";
                break;
        }
        var res = "(" + l + " " + i + " " + r + ")";
        this._stack.push(res);
        return node;
    };
    LambdaCompiler.prototype.visitConditional = function (node) {
        this.visit(node.test);
        this.visit(node.ifTrue);
        this.visit(node.ifFalse);
        var f = this._stack.pop();
        var t = this._stack.pop();
        var c = this._stack.pop();
        var res = "(" + c + " ? " + t + " : " + f + ")";
        this._stack.push(res);
        return node;
    };
    LambdaCompiler.prototype.visitParameter = function (node) {
        this._stack.push(node.name);
        return node;
    };
    LambdaCompiler.prototype.visitLambda = function (node) {
        this.visitMany(node.parameters);
        this.visit(node.body);
        var body = this._stack.pop();
        var n = node.parameters.length;
        var args = new Array(n);
        for (var i = 0; i < n; i++) {
            args[n - i - 1] = this._stack.pop();
        }
        var allArgs = args.join(", ");
        var res = "function(" + allArgs + ") { return " + body + "; }";
        this._stack.push(res);
        return node;
    };
    LambdaCompiler.prototype.visitInvoke = function (node) {
        this.visit(node.expression);
        this.visitMany(node.args);
        var n = node.args.length;
        var args = new Array(n);
        for (var i = 0; i < n; i++) {
            args[n - i - 1] = this._stack.pop();
        }
        var argList = args.join(", ");
        var func = this._stack.pop();
        var res = func + "(" + argList + ")";
        this._stack.push(res);
        return node;
    };
    LambdaCompiler.prototype.visitCall = function (node) {
        var res = "";
        if (node.obj !== null) {
            this.visit(node.obj);
            res = this._stack.pop() + ".";
        }
        this.visitMany(node.args);
        var n = node.args.length;
        var args = new Array(n);
        for (var i = 0; i < n; i++) {
            args[n - i - 1] = this._stack.pop();
        }
        var argList = args.join(", ");
        res += node.method + "(" + argList + ")";
        this._stack.push(res);
        return node;
    };
    LambdaCompiler.prototype.visitNew = function (node) {
        this.visitMany(node.args);
        var n = node.args.length;
        var args = new Array(n);
        for (var i = 0; i < n; i++) {
            args[n - i - 1] = this._stack.pop();
        }
        var argList = args.join(", ");
        var res = "new " + node.type + "(" + argList + ")";
        this._stack.push(res);
        return node;
    };
    LambdaCompiler.prototype.visitMember = function (node) {
        var res = "";
        if (node.obj !== null) {
            this.visit(node.obj);
            res = this._stack.pop() + ".";
        }
        res += node.member;
        this._stack.push(res);
        return node;
    };
    LambdaCompiler.prototype.visitIndex = function (node) {
        this.visit(node.obj);
        var res = this._stack.pop();
        this.visitMany(node.args);
        var n = node.args.length;
        var args = new Array(n);
        for (var i = 0; i < n; i++) {
            args[n - i - 1] = this._stack.pop();
        }
        var argList = args.join(", ");
        res += "[" + argList + "]";
        this._stack.push(res);
        return node;
    };
    return LambdaCompiler;
})(ExpressionVisitor);
var FreeVariableScanner = (function (_super) {
    __extends(FreeVariableScanner, _super);
    function FreeVariableScanner() {
        _super.call(this);
        this._stack = new Array();
        this._result = new Array();
    }
    Object.defineProperty(FreeVariableScanner.prototype, "result", {
        get: function () {
            return this._result;
        },
        enumerable: true,
        configurable: true
    });
    FreeVariableScanner.prototype.visitParameter = function (node) {
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
    };
    FreeVariableScanner.prototype.visitLambda = function (node) {
        this._stack.push(node.parameters);
        this.visit(node.body);
        this._stack.pop();
        return node;
    };
    return FreeVariableScanner;
})(ExpressionVisitor);
var ExpressionType;
(function (ExpressionType) {
    ExpressionType[ExpressionType["Constant"] = 0] = "Constant";
    ExpressionType[ExpressionType["Parameter"] = 1] = "Parameter";
    ExpressionType[ExpressionType["Lambda"] = 2] = "Lambda";
    ExpressionType[ExpressionType["Add"] = 3] = "Add";
    ExpressionType[ExpressionType["Subtract"] = 4] = "Subtract";
    ExpressionType[ExpressionType["Multiply"] = 5] = "Multiply";
    ExpressionType[ExpressionType["Divide"] = 6] = "Divide";
    ExpressionType[ExpressionType["Modulo"] = 7] = "Modulo";
    ExpressionType[ExpressionType["And"] = 8] = "And";
    ExpressionType[ExpressionType["Or"] = 9] = "Or";
    ExpressionType[ExpressionType["AndAlso"] = 10] = "AndAlso";
    ExpressionType[ExpressionType["OrElse"] = 11] = "OrElse";
    ExpressionType[ExpressionType["ExclusiveOr"] = 12] = "ExclusiveOr";
    ExpressionType[ExpressionType["Equal"] = 13] = "Equal";
    ExpressionType[ExpressionType["NotEqual"] = 14] = "NotEqual";
    ExpressionType[ExpressionType["LessThan"] = 15] = "LessThan";
    ExpressionType[ExpressionType["LessThanOrEqual"] = 16] = "LessThanOrEqual";
    ExpressionType[ExpressionType["GreaterThan"] = 17] = "GreaterThan";
    ExpressionType[ExpressionType["GreaterThanOrEqual"] = 18] = "GreaterThanOrEqual";
    ExpressionType[ExpressionType["LeftShift"] = 19] = "LeftShift";
    ExpressionType[ExpressionType["RightShift"] = 20] = "RightShift";
    ExpressionType[ExpressionType["Invoke"] = 21] = "Invoke";
    ExpressionType[ExpressionType["Not"] = 22] = "Not";
    ExpressionType[ExpressionType["Negate"] = 23] = "Negate";
    ExpressionType[ExpressionType["UnaryPlus"] = 24] = "UnaryPlus";
    ExpressionType[ExpressionType["OnesComplement"] = 25] = "OnesComplement";
    ExpressionType[ExpressionType["Condition"] = 26] = "Condition";
    ExpressionType[ExpressionType["New"] = 27] = "New";
    ExpressionType[ExpressionType["Call"] = 28] = "Call";
    ExpressionType[ExpressionType["Member"] = 29] = "Member";
    ExpressionType[ExpressionType["Index"] = 30] = "Index";
})(ExpressionType || (ExpressionType = {}));
var Binder = (function (_super) {
    __extends(Binder, _super);
    function Binder(resources) {
        _super.call(this);
        this._stack = new Array();
        this._resources = resources;
    }
    Binder.prototype.visitParameter = function (node) {
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
    };
    Binder.prototype.visitLambda = function (node) {
        this._stack.push(node.parameters);
        this.visit(node.body);
        this._stack.pop();
        return node;
    };
    return Binder;
})(ExpressionVisitor);
var PrintVisitor = (function (_super) {
    __extends(PrintVisitor, _super);
    function PrintVisitor() {
        _super.apply(this, arguments);
    }
    PrintVisitor.prototype.visitConstant = function (node) {
        return "Constant(" + node.value + ")";
    };
    PrintVisitor.prototype.visitParameter = function (node) {
        return "Parameter(" + node.name + ")";
    };
    PrintVisitor.prototype.visitBinary = function (node) {
        return ExpressionType[node.nodeType] + "(" + this.visit(node.left) + ", " + this.visit(node.right) + ")";
    };
    PrintVisitor.prototype.visitUnary = function (node) {
        return ExpressionType[node.nodeType] + "(" + this.visit(node.operand) + ")";
    };
    PrintVisitor.prototype.visitConditional = function (node) {
        return "Conditional(" + this.visit(node.test) + ", " + this.visit(node.ifTrue) + ", " + this.visit(node.ifFalse) + ")";
    };
    PrintVisitor.prototype.visitLambda = function (node) {
        var body = this.visit(node.body);
        var children = this.visitMany(node.parameters);
        children.unshift(body);
        return "Lambda(" + children.join(", ") + ")";
    };
    PrintVisitor.prototype.visitInvoke = function (node) {
        var expression = this.visit(node.expression);
        var children = this.visitMany(node.args);
        children.unshift(expression);
        return "Invoke(" + children.join(", ") + ")";
    };
    PrintVisitor.prototype.visitCall = function (node) {
        var children = this.visitMany(node.args);
        if (node.obj != null) {
            children.unshift(this.visit(node.obj));
        }
        children.unshift(node.method);
        return "Call(" + children.join(", ") + ")";
    };
    PrintVisitor.prototype.visitNew = function (node) {
        var children = this.visitMany(node.args);
        children.unshift(node.type);
        return "New(" + children.join(", ") + ")";
    };
    PrintVisitor.prototype.visitMember = function (node) {
        var children = [];
        if (node.obj != null) {
            children.unshift(this.visit(node.obj));
        }
        children.unshift(node.member);
        return "Member(" + children.join(", ") + ")";
    };
    PrintVisitor.prototype.visitIndex = function (node) {
        var children = this.visitMany(node.args);
        if (node.obj != null) {
            children.unshift(this.visit(node.obj));
        }
        return "Index(" + children.join(", ") + ")";
    };
    return PrintVisitor;
})(ExpressionVisitorGeneric);
var BonsaiVisitor = (function (_super) {
    __extends(BonsaiVisitor, _super);
    function BonsaiVisitor() {
        _super.apply(this, arguments);
    }
    BonsaiVisitor.prototype.visitConstant = function (node) {
        return [":", node.value];
    };
    BonsaiVisitor.prototype.visitParameter = function (node) {
        return ["$", node.name];
    };
    BonsaiVisitor.prototype.visitBinary = function (node) {
        var i = "";
        switch (node.nodeType) {
            case 3 /* Add */:
                i = "+";
                break;
            case 4 /* Subtract */:
                i = "-";
                break;
            case 5 /* Multiply */:
                i = "*";
                break;
            case 6 /* Divide */:
                i = "/";
                break;
            case 7 /* Modulo */:
                i = "%";
                break;
            case 8 /* And */:
                i = "&";
                break;
            case 9 /* Or */:
                i = "|";
                break;
            case 10 /* AndAlso */:
                i = "&&";
                break;
            case 11 /* OrElse */:
                i = "||";
                break;
            case 12 /* ExclusiveOr */:
                i = "^";
                break;
            case 13 /* Equal */:
                i = "===";
                break;
            case 14 /* NotEqual */:
                i = "!==";
                break;
            case 15 /* LessThan */:
                i = "<";
                break;
            case 16 /* LessThanOrEqual */:
                i = "<=";
                break;
            case 17 /* GreaterThan */:
                i = ">";
                break;
            case 18 /* GreaterThanOrEqual */:
                i = ">=";
                break;
            case 19 /* LeftShift */:
                i = "<<";
                break;
            case 20 /* RightShift */:
                i = ">>";
                break;
        }
        return [i, this.visit(node.left), this.visit(node.right)];
    };
    BonsaiVisitor.prototype.visitUnary = function (node) {
        var i = "";
        switch (node.nodeType) {
            case 23 /* Negate */:
                i = "-";
                break;
            case 24 /* UnaryPlus */:
                i = "+";
                break;
            case 22 /* Not */:
                i = "!";
                break;
            case 25 /* OnesComplement */:
                i = "~";
                break;
        }
        return [i, this.visit(node.operand)];
    };
    BonsaiVisitor.prototype.visitConditional = function (node) {
        return ["?:", this.visit(node.test), this.visit(node.ifTrue), this.visit(node.ifFalse)];
    };
    BonsaiVisitor.prototype.visitLambda = function (node) {
        return ["=>", this.visit(node.body), this.visitMany(node.parameters)];
    };
    BonsaiVisitor.prototype.visitInvoke = function (node) {
        var expression = this.visit(node.expression);
        var args = this.visitMany(node.args);
        return ["()", expression, args];
    };
    BonsaiVisitor.prototype.visitCall = function (node) {
        var args = [];
        if (node.obj != null) {
            args.unshift(this.visit(node.obj));
        }
        args.unshift(this.visitMany(node.args));
        return [".()", node.method, args];
    };
    BonsaiVisitor.prototype.visitNew = function (node) {
        var args = this.visitMany(node.args);
        return ["new", args];
    };
    BonsaiVisitor.prototype.visitMember = function (node) {
        var res = [".", node.member];
        if (node.obj != null) {
            res.unshift(this.visit(node.obj));
        }
        return res;
    };
    BonsaiVisitor.prototype.visitIndex = function (node) {
        throw new Error("not implemented");
    };
    return BonsaiVisitor;
})(ExpressionVisitorGeneric);
//# sourceMappingURL=compiler.js.map